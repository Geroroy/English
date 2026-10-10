// 문장별 시네마틱 장면 사진 생성기 (OpenAI gpt-image-1)
//
// 준비물: 환경 변수 OPENAI_API_KEY, 네트워크에서 api.openai.com 허용, ffmpeg
// 실행:   node tools/generate-photos.mjs [--only 1,2] [--force] [--quality low|medium|high]
// 결과:   photos/<레슨>-s<번호>.jpg (960×540) 와 js/scenes.js
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const KEY = process.env.OPENAI_API_KEY;
if (!KEY) throw new Error("OPENAI_API_KEY 환경 변수가 필요해요");
const argv = process.argv.slice(2);
const opt = (name) => (argv.includes(`--${name}`) ? argv[argv.indexOf(`--${name}`) + 1] : null);
const only = opt("only") ? new Set(opt("only").split(",").map(Number)) : null;
const force = argv.includes("--force");
const quality = opt("quality") || "medium";

function load(file, name) {
  const c = {};
  vm.createContext(c);
  if (fs.existsSync(file)) vm.runInContext(fs.readFileSync(file, "utf8"), c);
  return c[name];
}
const LESSONS = load(path.join(ROOT, "js/lessons.js"), "LESSONS");
const scenesFile = path.join(ROOT, "js/scenes.js");
const photos = (load(scenesFile, "SCENES") || { photos: {} }).photos;

// 앱 분위기(클래식·시네마틱)에 맞춘 공통 연출
function promptFor(s) {
  return [
    `A cinematic film still of an everyday moment: ${s.scene}.`,
    `It illustrates the English line "${s.en}".`,
    "Photorealistic, shot on 35mm film, anamorphic lens, shallow depth of field, soft natural light,",
    "muted warm color grading with deep navy shadows, subtle film grain, elegant and classic mood.",
    "No text, no letters, no logos, no watermarks. Faces natural and not looking at the camera."
  ].join(" ");
}

const outDir = path.join(ROOT, "photos");
fs.mkdirSync(outDir, { recursive: true });
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "photo-"));
let made = 0;

for (const lesson of LESSONS) {
  if (only && !only.has(lesson.id)) continue;
  for (const [i, s] of lesson.sentences.entries()) {
    const id = `${lesson.id}-s${i}`;
    const file = `${id}.jpg`;
    if (photos[id] && !force && fs.existsSync(path.join(outDir, file))) continue;
    const res = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "gpt-image-1", prompt: promptFor(s), size: "1536x1024", quality, n: 1 })
    });
    if (!res.ok) throw new Error(`${id}: ${res.status} ${await res.text()}`);
    const data = await res.json();
    const png = path.join(tmp, "img.png");
    fs.writeFileSync(png, Buffer.from(data.data[0].b64_json, "base64"));
    // 16:9로 잘라 화면 폭에 맞는 크기로 저장 (용량 절약)
    execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-i", png, "-vf", "crop=iw:iw*9/16,scale=960:540", "-q:v", "4", path.join(outDir, file)]);
    photos[id] = { src: `photos/${file}`, credit: "AI generated" };
    made++;
    console.log(`${id}  ${s.scene}`);
  }
}

const sorted = Object.fromEntries(
  Object.entries(photos).sort(([a], [b]) => {
    const [la, sa] = a.split("-s").map(Number);
    const [lb, sb] = b.split("-s").map(Number);
    return la - lb || sa - sb;
  })
);
fs.writeFileSync(
  scenesFile,
  `// 문장별 장면 사진 (tools/generate-photos.mjs 또는 tools/fetch-photos.mjs가 채움)
// "레슨-s번호" -> { src: "photos/파일", credit: "출처" }
// 사진이 없는 문장은 화면에 '사진 준비 중' 프레임이 나온다.
globalThis.SCENES = {
  photos: ${JSON.stringify(sorted, null, 2).replace(/\n/g, "\n  ")}
};
`
);
fs.rmSync(tmp, { recursive: true, force: true });
console.log(`완료: 새로 ${made}장, 전체 ${Object.keys(sorted).length}장`);
