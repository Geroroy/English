// 감정 연기 음성 생성기 (OpenAI gpt-4o-mini-tts)
// 대사마다 '연기 지시문'을 붙여 성우처럼 감정을 실어 읽게 한다.
//
// 준비물: 환경 변수 OPENAI_API_KEY, 네트워크에서 api.openai.com 허용, ffmpeg
// 실행:   node tools/openai-voice.mjs [--only 1,2] [--force]
// 결과:   audio/*.mp3 와 js/audio.js (문장 → 파일 목록, 사용한 목소리)
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const KEY = process.env.OPENAI_API_KEY;
if (!KEY) throw new Error("OPENAI_API_KEY 환경 변수가 필요해요");
const argv = process.argv.slice(2);
const onlyArg = argv.includes("--only") ? argv[argv.indexOf("--only") + 1] : null;
const only = onlyArg ? new Set(onlyArg.split(",").map(Number)) : null;
const force = argv.includes("--force");

const MODEL = "gpt-4o-mini-tts";
const VOICES = { main: "coral", A: "ash", B: "coral" };

// 감정별 연기 지시 (Core.toneOf 결과 + 장면으로 지시문을 만든다)
const DIRECTION = {
  excited: "Genuinely thrilled and bright, smiling as you speak, with lively energy.",
  sorry: "Soft and sincere, a little hesitant and apologetic or anxious, slightly slower.",
  question: "Curious and friendly, with a natural rising intonation, as if you really want to know.",
  calm: "Warm, relaxed and natural, like chatting with a friend."
};
function instructionsFor(text, scene, role) {
  const tone = ctx.Core.toneOf(text);
  return [
    "You are a voice actor performing one line in a realistic, cinematic everyday scene in American English.",
    scene ? `Scene: ${scene}.` : "",
    role ? `You are character ${role} in a two-person conversation.` : "",
    `Emotion: ${DIRECTION[tone.name]}`,
    "Sound like a real person, not a narrator. Clear pronunciation for English learners, natural pace."
  ].filter(Boolean).join(" ");
}

const ctx = {};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(ROOT, "js/lessons.js"), "utf8"), ctx);
vm.runInContext(fs.readFileSync(path.join(ROOT, "js/core.js"), "utf8"), ctx);

const jobs = [];
for (const l of ctx.LESSONS) {
  if (only && !only.has(l.id)) continue;
  l.sentences.forEach((s) => jobs.push({ text: s.en, who: "main", scene: s.scene }));
  l.dialogue.forEach((d) => jobs.push({ text: d.en, who: d.s, scene: l.sentences[0].scene, role: d.s }));
  l.writing.samples.forEach((s) => jobs.push({ text: s, who: "main" }));
}

const outDir = path.join(ROOT, "audio");
fs.mkdirSync(outDir, { recursive: true });
const manifestPath = path.join(ROOT, "js/audio.js");
const manifest = {};
if (only && fs.existsSync(manifestPath)) {
  const c = {};
  vm.createContext(c);
  vm.runInContext(fs.readFileSync(manifestPath, "utf8"), c);
  if (c.AUDIO_VOICES && c.AUDIO_VOICES.main === VOICES.main) Object.assign(manifest, c.AUDIO || {});
}

let made = 0;
for (const job of jobs) {
  const voice = VOICES[job.who] || VOICES.main;
  const key = `${voice}|${job.text}`;
  if (manifest[key] && !force && fs.existsSync(path.join(outDir, manifest[key]))) continue;
  const instructions = instructionsFor(job.text, job.scene, job.role);
  const file = createHash("sha1").update(`${MODEL}|${key}|${instructions}`).digest("hex").slice(0, 12) + ".mp3";
  const target = path.join(outDir, file);
  if (force || !fs.existsSync(target)) {
    const res = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: MODEL, voice, input: job.text, instructions, response_format: "mp3" })
    });
    if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
    fs.writeFileSync(target, Buffer.from(await res.arrayBuffer()));
    made++;
    if (made % 20 === 0) console.log(`${made}개 생성…`);
  }
  manifest[key] = file;
}

// 목록에 없는 예전 파일은 지운다 (전체 생성일 때만)
if (!only) {
  const keep = new Set(Object.values(manifest));
  for (const f of fs.readdirSync(outDir)) if (f.endsWith(".mp3") && !keep.has(f)) fs.rmSync(path.join(outDir, f));
}

const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
fs.writeFileSync(
  manifestPath,
  "// 미리 녹음한 문장 음성 목록 (tools/openai-voice.mjs가 생성). \"목소리|문장\" -> audio/ 파일 이름\n" +
    `globalThis.AUDIO_VOICES = ${JSON.stringify(VOICES)};\n` +
    `globalThis.AUDIO = ${JSON.stringify(sorted, null, 1)};\n`
);
console.log(`완료: 새로 ${made}개, 전체 ${Object.keys(sorted).length}개`);
