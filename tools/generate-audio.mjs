// 문장 음성(MP3) 생성기: Kokoro-82M 신경망 음성 모델로 앱의 모든 영어 문장을 미리 녹음한다.
//
// 준비물 (npm 레지스트리에서 받을 수 있음):
//   npm pack kokoro-js@1.2.1        → 음성(voices/*.bin)과 발음 변환 코드
//   npm pack kokoro-q8-shards@1.0.0 → 모델 가중치(model_quantized.onnx를 6조각으로 나눈 것)
//   npm pack expo-kokoro@1.1.9      → tokenizer.json (모델 어휘)
//   npm install onnxruntime-node@1.22.0 phonemizer@1.2.1  (이 스크립트를 실행하는 폴더에)
//   ffmpeg
//
// 실행:
//   node tools/generate-audio.mjs --kokoro <kokoro-js 폴더> --shards <shards 폴더> \
//     --tokenizer <tokenizer.json> --modules <node_modules 상위 폴더> [--only 1,2]
//
// 결과: audio/*.mp3 와 js/audio.js(문장 → 파일 이름 목록). 이미 있는 파일은 건너뛴다.
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, all) => (a.startsWith("--") ? [...acc, [a.slice(2), all[i + 1]]] : acc), [])
);
for (const k of ["kokoro", "shards", "tokenizer", "modules"]) {
  if (!args[k]) throw new Error(`--${k} 경로가 필요해요`);
}
const MODEL_SHA256 = "fbae9257e1e05ffc727e951ef9b9c98418e6d79f1c9b6b13bd59f5c9028a1478";
const VOICE = { main: "af_heart", A: "am_michael", B: "af_heart" };
const SPEED = 0.95;

// ---------- 모델 ----------
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "kokoro-"));
const modelPath = path.join(tmp, "model.onnx");
const parts = fs.readdirSync(args.shards).filter((f) => /^kokoro-q8\.part\d+\.bin$/.test(f)).sort((a, b) => parseInt(a.match(/\d+/)[0]) - parseInt(b.match(/\d+/)[0]));
fs.writeFileSync(modelPath, Buffer.concat(parts.map((f) => fs.readFileSync(path.join(args.shards, f)))));
const sha = createHash("sha256").update(fs.readFileSync(modelPath)).digest("hex");
if (sha !== MODEL_SHA256) throw new Error(`모델 해시가 달라요: ${sha}`);

const require = createRequire(path.join(path.resolve(args.modules), "noop.js"));
const ort = require("onnxruntime-node");
const session = await ort.InferenceSession.create(modelPath);

// kokoro-js의 발음 변환 함수(정규화 + espeak 음소 변환)를 그대로 사용한다.
const src = fs
  .readFileSync(path.join(args.kokoro, "dist/kokoro.js"), "utf8")
  .replace(/^import\{[^}]*\}from"@huggingface\/transformers";/, "const e=null,a=null,t=null,r=null,n={backends:{onnx:{wasm:{}}}};")
  .replace('from"phonemizer"', `from${JSON.stringify(pathToFileURL(require.resolve("phonemizer")).href)}`);
const shim = path.join(tmp, "kokoro-phonemize.mjs");
fs.writeFileSync(shim, src + "\nexport{m as phonemizeText};\n");
const { phonemizeText } = await import(pathToFileURL(shim).href);

const vocab = JSON.parse(fs.readFileSync(args.tokenizer, "utf8")).model.vocab;
const voices = {};
function voice(name) {
  if (!voices[name]) {
    const buf = fs.readFileSync(path.join(args.kokoro, "voices", `${name}.bin`));
    voices[name] = new Float32Array(buf.buffer, buf.byteOffset, buf.byteLength / 4);
  }
  return voices[name];
}

async function synth(text, voiceName) {
  const phonemes = await phonemizeText(text, "a");
  const ids = [...phonemes].map((c) => vocab[c]).filter((x) => x !== undefined);
  const tokens = [0, ...ids, 0];
  const v = voice(voiceName);
  const ref = Math.min(ids.length, 509) * 256;
  const feeds = {
    input_ids: new ort.Tensor("int64", BigInt64Array.from(tokens.map(BigInt)), [1, tokens.length]),
    style: new ort.Tensor("float32", v.slice(ref, ref + 256), [1, 256]),
    speed: new ort.Tensor("float32", [SPEED], [1])
  };
  const out = await session.run(feeds);
  return { audio: out.waveform.data, phonemes };
}

function wav(samples, rate = 24000) {
  const b = Buffer.alloc(44 + samples.length * 2);
  b.write("RIFF", 0); b.writeUInt32LE(36 + samples.length * 2, 4); b.write("WAVE", 8);
  b.write("fmt ", 12); b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20); b.writeUInt16LE(1, 22);
  b.writeUInt32LE(rate, 24); b.writeUInt32LE(rate * 2, 28); b.writeUInt16LE(2, 32); b.writeUInt16LE(16, 34);
  b.write("data", 36); b.writeUInt32LE(samples.length * 2, 40);
  samples.forEach((s, i) => b.writeInt16LE(Math.round(Math.max(-1, Math.min(1, s)) * 32767), 44 + i * 2));
  return b;
}

// ---------- 문장 목록 ----------
const ctx = {};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(ROOT, "js/lessons.js"), "utf8"), ctx);
const only = args.only ? new Set(args.only.split(",").map(Number)) : null;
const jobs = [];
for (const l of ctx.LESSONS) {
  if (only && !only.has(l.id)) continue;
  l.sentences.forEach((s) => jobs.push([s.en, VOICE.main]));
  l.dialogue.forEach((d) => jobs.push([d.en, VOICE[d.s] || VOICE.main]));
  l.writing.samples.forEach((s) => jobs.push([s, VOICE.main]));
}

export function clipName(text, voiceName) {
  return createHash("sha1").update(`${voiceName}|${text}`).digest("hex").slice(0, 12) + ".mp3";
}

const outDir = path.join(ROOT, "audio");
fs.mkdirSync(outDir, { recursive: true });
const manifestPath = path.join(ROOT, "js/audio.js");
const manifest = {};
if (fs.existsSync(manifestPath)) {
  const c = {};
  vm.createContext(c);
  vm.runInContext(fs.readFileSync(manifestPath, "utf8"), c);
  Object.assign(manifest, c.AUDIO || {});
}

let made = 0;
for (const [text, voiceName] of jobs) {
  const file = clipName(text, voiceName);
  const key = `${voiceName}|${text}`;
  const target = path.join(outDir, file);
  if (!fs.existsSync(target)) {
    const { audio } = await synth(text, voiceName);
    const w = path.join(tmp, "clip.wav");
    fs.writeFileSync(w, wav(audio));
    execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-i", w, "-af", "silenceremove=start_periods=1:start_threshold=-50dB,areverse,silenceremove=start_periods=1:start_threshold=-50dB,areverse,apad=pad_dur=0.15", "-ac", "1", "-codec:a", "libmp3lame", "-b:a", "48k", target]);
    made++;
    if (made % 20 === 0) console.log(`${made}개 생성…`);
  }
  manifest[key] = file;
}

const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
fs.writeFileSync(
  manifestPath,
  "// 미리 녹음한 문장 음성 목록 (tools/generate-audio.mjs가 생성). \"목소리|문장\" -> audio/ 파일 이름\n" +
    `globalThis.AUDIO = ${JSON.stringify(sorted, null, 1)};\n`
);
fs.rmSync(tmp, { recursive: true, force: true });
console.log(`완료: 새로 ${made}개, 전체 ${Object.keys(sorted).length}개`);
