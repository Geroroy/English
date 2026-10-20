// 카카오톡 학습 알림 전송기: 정한 시각마다 오늘의 영어 한 문장을 카카오톡 '나에게 보내기'로 보낸다.
// 브라우저 앱은 열려 있을 때만 보낼 수 있으므로, 항상 받고 싶다면 PC나 서버에서 이 스크립트를 켜 둔다.
// 앱과 같은 js/core.js(Core.nextFire, Core.dueFire, Core.kakaoMessage)를 그대로 불러 써서 일정 계산이 똑같다.
//
// 준비물:
//   Node 18 이상 (추가 설치 없음, 내장 fetch 사용)
//   카카오 디벨로퍼스 앱의 REST API 키, '카카오톡 메시지 전송'(talk_message) 동의로 받은 refresh token
//   (발급 방법은 README의 '카카오톡 알림' 참고. 아래 --auth 로 발급할 수 있음)
//
// 환경 변수:
//   KAKAO_REST_KEY       REST API 키 (필수, --dry-run 제외)
//   KAKAO_REFRESH_TOKEN  refresh token (필수, --dry-run·--auth 제외)
//   KAKAO_CLIENT_SECRET  카카오 로그인 Client Secret을 켰다면 (선택)
//   APP_URL              메시지 속 "오늘 10분 시작하기" 링크이자 --auth의 Redirect URI (선택)
//
// 실행:
//   node tools/kakao-timer.mjs --schedule kakao-schedule.json     앱의 "일정 내보내기"로 복사한 JSON
//   node tools/kakao-timer.mjs --times 08:00,21:30 --days 1-5     평일 08:00, 21:30
//   node tools/kakao-timer.mjs --every 60 --from 09:00 --to 22:00 09~22시 사이 60분마다 (최소 15분)
//   node tools/kakao-timer.mjs --once                              지금 한 번 보내기
//   node tools/kakao-timer.mjs --dry-run --times 08:00,21:00      보내지 않고 다음 시각만 출력
//   node tools/kakao-timer.mjs --auth                              인가 URL 출력 → 로그인 후 주소창의 code로
//   node tools/kakao-timer.mjs --auth --code <code>                refresh token 발급
//
// 다음 시각까지 기다렸다가 보내고, 이를 반복한다 (Ctrl+C로 종료). 카카오가 새 refresh token을 주면 출력해 알려 준다.
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const FLAGS = new Set(["once", "dry-run", "auth", "help"]);

// --이름 값 / --플래그
function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith("--")) throw new Error(`알 수 없는 인자: ${a}`);
    const [k, inline] = a.slice(2).split(/=(.*)/s);
    if (FLAGS.has(k)) out[k] = true;
    else if (inline !== undefined) out[k] = inline;
    else if (argv[i + 1] !== undefined && !argv[i + 1].startsWith("--")) out[k] = argv[++i];
    else throw new Error(`--${k} 값이 필요해요`);
  }
  return out;
}
const args = parseArgs(process.argv.slice(2));
if (args.help) {
  console.log(fs.readFileSync(fileURLToPath(import.meta.url), "utf8").split("\nimport ")[0]);
  process.exit(0);
}
if (typeof fetch !== "function") throw new Error("Node 18 이상이 필요해요 (내장 fetch).");

// ---------- 앱과 같은 로직 불러오기 ----------
const ctx = {};
vm.createContext(ctx);
for (const f of ["js/lessons.js", "js/core.js"]) vm.runInContext(fs.readFileSync(path.join(ROOT, f), "utf8"), ctx, { filename: f });
const { Core, LESSONS } = ctx;

const env = process.env;
const APP_URL = env.APP_URL || "";
const log = (...m) => console.log(`[${new Date().toLocaleString("ko-KR", { hour12: false })}]`, ...m);
const hhmm = (d) => `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;

// ---------- 일정 ----------
// "1-5", "0,6", "1-5,0" → [1,2,3,4,5] 등
function parseDays(s) {
  const days = new Set();
  for (const part of String(s).split(",").map((x) => x.trim()).filter(Boolean)) {
    const m = /^([0-6])(?:-([0-6]))?$/.exec(part);
    if (!m) throw new Error(`--days 형식이 잘못됐어요: ${part} (0=일 … 6=토, 예: 1-5 또는 0,6)`);
    const [a, b] = [Number(m[1]), Number(m[2] ?? m[1])];
    for (let i = 0; i <= (b - a + 7) % 7; i++) days.add((a + i) % 7); // 5-1처럼 주말을 넘기는 범위도 허용
  }
  return [...days].sort((x, y) => x - y);
}
function checkTime(t, name) {
  if (!Core.validTime(t)) throw new Error(`${name} 시각 형식이 잘못됐어요: ${t} (HH:MM)`);
  return t;
}
function buildSchedule() {
  let s = Core.defaultKakao();
  if (args.schedule) {
    const saved = JSON.parse(fs.readFileSync(args.schedule, "utf8"));
    s = Object.assign(s, saved.settings && saved.settings.kakao ? saved.settings.kakao : saved);
  }
  if (args.times) {
    s.mode = "daily";
    s.times = String(args.times).split(",").map((t) => checkTime(t.trim(), "--times"));
  }
  if (args.every || args.from || args.to) {
    s.mode = "interval";
    if (args.every) s.every = Number(args.every);
    if (args.from) s.from = checkTime(args.from, "--from");
    if (args.to) s.to = checkTime(args.to, "--to");
  }
  if (args.days) s.days = parseDays(args.days);
  if (!Number.isFinite(Number(s.every))) throw new Error("--every 는 분 단위 숫자예요");
  s.every = Math.max(Core.MIN_EVERY, Math.round(Number(s.every)));
  s.enabled = true; // 스크립트를 켰다면 보낸다
  s.lastSent = Date.now(); // 시작 전에 지난 시각은 보내지 않음
  return s;
}
function describe(s) {
  const days = s.days.length === 7 ? "매일" : s.days.map((d) => "일월화수목금토"[d]).join("·") || "(요일 없음)";
  return s.mode === "interval" ? `${days} ${s.from}~${s.to} 사이 ${s.every}분마다` : `${days} ${s.times.join(", ") || "(시각 없음)"}`;
}

// ---------- 카카오 API ----------
async function kakaoToken(params) {
  if (env.KAKAO_CLIENT_SECRET) params.client_secret = env.KAKAO_CLIENT_SECRET;
  const res = await fetch("https://kauth.kakao.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
    body: new URLSearchParams(params)
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.access_token) throw new Error(`토큰 발급 실패 (${res.status}): ${data.error_code || data.error || ""} ${data.error_description || ""}`.trim());
  return data;
}

let access = null;
let accessExp = 0;
let refresh = env.KAKAO_REFRESH_TOKEN;
async function accessToken() {
  if (access && accessExp - Date.now() > 60 * 1000) return access;
  const data = await kakaoToken({ grant_type: "refresh_token", client_id: env.KAKAO_REST_KEY, refresh_token: refresh });
  access = data.access_token;
  accessExp = Date.now() + (data.expires_in || 0) * 1000;
  if (data.refresh_token && data.refresh_token !== refresh) {
    refresh = data.refresh_token;
    log("새 refresh token을 받았어요. 다음 실행부터 KAKAO_REFRESH_TOKEN을 이 값으로 바꾸세요:");
    console.log(refresh);
  }
  return access;
}

async function send(when) {
  const template = Core.kakaoMessage(Core.pickSentence(LESSONS, null, when), APP_URL);
  for (let attempt = 0; attempt < 2; attempt++) {
    const res = await fetch("https://kapi.kakao.com/v2/api/talk/memo/default/send", {
      method: "POST",
      headers: { Authorization: `Bearer ${await accessToken()}`, "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
      body: new URLSearchParams({ template_object: JSON.stringify(template) })
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.result_code === 0) return template;
    if (attempt === 0 && data.code === -401) {
      access = null; // 서버에서 끊긴 토큰: 한 번만 갱신해서 다시 시도
      continue;
    }
    throw new Error(`전송 실패 (${res.status}): ${data.code ?? ""} ${data.msg || ""}`.trim());
  }
}

// ---------- 실행 ----------
function requireEnv(...names) {
  const missing = names.filter((n) => !env[n]);
  if (missing.length) throw new Error(`환경 변수가 필요해요: ${missing.join(", ")} (파일 머리말 참고)`);
}

async function auth() {
  requireEnv("KAKAO_REST_KEY");
  const redirect = args.redirect || APP_URL || "http://localhost:8000/";
  if (!args.code) {
    const u = new URL("https://kauth.kakao.com/oauth/authorize");
    u.search = new URLSearchParams({ client_id: env.KAKAO_REST_KEY, redirect_uri: redirect, response_type: "code", scope: "talk_message" });
    console.log("1) 아래 주소를 브라우저에서 열고 카카오 로그인 + '카카오톡 메시지 전송'에 동의하세요.");
    console.log(`   (Redirect URI ${redirect} 가 카카오 디벨로퍼스에 등록돼 있어야 해요. 바꾸려면 --redirect 또는 APP_URL)`);
    console.log(`\n${u}\n`);
    console.log("2) 돌아온 주소의 ?code= 값을 복사해 실행하세요:");
    console.log("   node tools/kakao-timer.mjs --auth --code <code>");
    return;
  }
  const data = await kakaoToken({ grant_type: "authorization_code", client_id: env.KAKAO_REST_KEY, redirect_uri: redirect, code: args.code });
  if (!data.refresh_token) throw new Error("refresh token이 오지 않았어요.");
  const days = Math.round((data.refresh_token_expires_in || 0) / 86400);
  console.log(`refresh token (약 ${days}일 유효, 만료 전 사용하면 자동 연장):\n${data.refresh_token}\n`);
  console.log("이제 KAKAO_REFRESH_TOKEN 환경 변수에 넣고 실행하세요.");
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  if (args.auth) return auth();
  const s = buildSchedule();

  if (args["dry-run"]) {
    const now = new Date();
    console.log(`일정: ${describe(s)}`);
    let t = now;
    const list = [];
    for (let i = 0; i < 5; i++) {
      t = Core.nextFire(s, t);
      if (!t) break;
      list.push(t);
    }
    if (!list.length) console.log("보낼 시각이 없어요. 시각·요일을 확인해 주세요.");
    for (const d of list) console.log(`  - ${Core.describeFire(d, now)}`);
    const sample = Core.kakaoMessage(Core.pickSentence(LESSONS, null, list[0] || now), APP_URL);
    console.log(`\n보낼 메시지 예시 (${sample.text.length}자):\n${sample.text}\n[${sample.button_title}] ${APP_URL || "(APP_URL 없음: 링크 없이 보냄)"}`);
    return;
  }

  requireEnv("KAKAO_REST_KEY", "KAKAO_REFRESH_TOKEN");
  if (args.once) {
    const tpl = await send(new Date());
    log("보냈어요:", tpl.text.split("\n").filter(Boolean).slice(1, 2).join(""));
    return;
  }

  log(`일정: ${describe(s)}`);
  let announced = null;
  for (;;) {
    const now = new Date();
    const due = Core.dueFire(s, now);
    if (due) {
      try {
        await send(due);
        log(`${hhmm(due)} 알림을 보냈어요.`);
      } catch (e) {
        log(`${hhmm(due)} 알림 실패: ${e.message}`);
      }
      s.lastSent = due.getTime(); // 실패해도 같은 시각을 계속 다시 보내지는 않음
      continue;
    }
    const next = Core.nextFire(s, now);
    if (!next) throw new Error("보낼 시각이 없어요. 시각·요일을 확인해 주세요.");
    if (announced !== next.getTime()) {
      announced = next.getTime();
      log(`다음 알림: ${Core.describeFire(next, now)}`);
    }
    // 잠자기·시계 변경에 대비해 최대 1분씩 나눠 기다린다
    await sleep(Math.min(60 * 1000, Math.max(1000, next - now)));
  }
}

main().catch((e) => {
  console.error(`오류: ${e.message}`);
  process.exit(1);
});
