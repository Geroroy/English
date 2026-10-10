// 문장별 실사 장면 사진 받기 (Unsplash API)
//
// 준비물:
//   - Unsplash 무료 API 키: https://unsplash.com/developers 에서 앱을 만들고 Access Key를 발급
//   - 네트워크에서 api.unsplash.com, images.unsplash.com 허용
//
// 실행:
//   UNSPLASH_ACCESS_KEY=... node tools/fetch-photos.mjs [--only 1,2] [--force]
//
// 각 문장의 scene(검색어)으로 가로 사진을 찾아 photos/<레슨>-s<번호>.jpg 로 저장하고,
// js/scenes.js 에 사진가 이름과 원본 주소를 기록한다. 한 레슨 안에서는 같은 사진을 두 번 쓰지 않는다.
// Unsplash API 규칙에 따라 사진을 쓸 때 download_location 을 호출하고, 화면에 사진가 이름을 표시한다.
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const KEY = process.env.UNSPLASH_ACCESS_KEY;
if (!KEY) throw new Error("UNSPLASH_ACCESS_KEY 환경 변수가 필요해요");
const argv = process.argv.slice(2);
const onlyArg = argv.includes("--only") ? argv[argv.indexOf("--only") + 1] : null;
const only = onlyArg ? new Set(onlyArg.split(",").map(Number)) : null;
const force = argv.includes("--force");

function load(file, name) {
  const c = {};
  vm.createContext(c);
  if (fs.existsSync(file)) vm.runInContext(fs.readFileSync(file, "utf8"), c);
  return c[name];
}
const LESSONS = load(path.join(ROOT, "js/lessons.js"), "LESSONS");
const scenesFile = path.join(ROOT, "js/scenes.js");
const photos = (load(scenesFile, "SCENES") || { photos: {} }).photos;

async function api(url) {
  const res = await fetch(url, { headers: { Authorization: `Client-ID ${KEY}`, "Accept-Version": "v1" } });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  return res.json();
}

const outDir = path.join(ROOT, "photos");
fs.mkdirSync(outDir, { recursive: true });

for (const lesson of LESSONS) {
  if (only && !only.has(lesson.id)) continue;
  const used = new Set();
  for (const [i, s] of lesson.sentences.entries()) {
    const id = `${lesson.id}-s${i}`;
    if (photos[id] && !force) {
      used.add(photos[id].unsplashId);
      continue;
    }
    const q = encodeURIComponent(s.scene);
    const data = await api(`https://api.unsplash.com/search/photos?query=${q}&orientation=landscape&per_page=10&content_filter=high`);
    const pick = data.results.find((r) => !used.has(r.id));
    if (!pick) {
      console.warn(`사진 없음: ${id} (${s.scene})`);
      continue;
    }
    used.add(pick.id);
    // 화면 폭에 맞춘 크기(가로 960px, 16:9)로 받아 용량을 줄인다
    const img = await fetch(`${pick.urls.raw}&w=960&h=540&fit=crop&crop=entropy&q=70&fm=jpg`);
    if (!img.ok) throw new Error(`사진 받기 실패: ${id}`);
    const file = `${id}.jpg`;
    fs.writeFileSync(path.join(outDir, file), Buffer.from(await img.arrayBuffer()));
    await api(pick.links.download_location); // Unsplash 규칙: 사진 사용을 알림
    photos[id] = {
      src: `photos/${file}`,
      credit: pick.user.name,
      link: `${pick.links.html}?utm_source=the_ten_minutes&utm_medium=referral`,
      unsplashId: pick.id
    };
    console.log(`${id}  ${s.scene}  →  ${pick.user.name}`);
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
  `// 문장별 장면 사진 (tools/fetch-photos.mjs가 채움)
// "레슨-s번호" -> { src: "photos/파일", credit: "사진가 이름", link: "원본 주소" }
// 사진이 없는 문장은 화면에 '사진 준비 중' 프레임이 나온다.
globalThis.SCENES = {
  photos: ${JSON.stringify(sorted, null, 2).replace(/\n/g, "\n  ")}
};
`
);
console.log(`완료: 사진 ${Object.keys(sorted).length}장`);
