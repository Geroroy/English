// 실행: node --test tests/
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const ctx = {};
vm.createContext(ctx);
for (const f of ["js/lessons.js", "js/core.js"]) {
  vm.runInContext(readFileSync(new URL(`../${f}`, import.meta.url), "utf8"), ctx);
}
const { Core, LESSONS, FREE_PROMPTS } = ctx;

test("레슨 데이터 형식", () => {
  const ids = new Set();
  for (const l of LESSONS) {
    assert.ok(!ids.has(l.id), `중복 id ${l.id}`);
    ids.add(l.id);
    assert.ok([1, 2, 3].includes(l.level));
    assert.equal(l.sentences.length, 10, `Day ${l.id}는 10문장`);
    const natives = l.sentences.filter((s) => s.native);
    assert.ok(natives.length >= 1 && natives.length <= 2, `Day ${l.id} 원어민 표현 1~2개`);
    for (const n of natives) assert.ok(n.note, `${n.en} 설명 없음`);
    for (const s of l.sentences) assert.ok(s.en && s.ko && s.scene, JSON.stringify(s));
    assert.ok(l.dialogue.length >= 3);
    const drills = Core.drillSentences(l);
    assert.equal(drills.length, 3, `Day ${l.id} 문장 만들기 3개`);
    assert.ok(drills.some((d) => d.native), `Day ${l.id} 문장 만들기에 원어민 표현 포함`);
    assert.ok(l.writing.samples.length >= 1);
  }
  assert.ok(FREE_PROMPTS.length > 0);
});

test("모든 예시 답안이 해당 레슨의 작문 체크를 통과", () => {
  const minSentences = { 1: 1, 2: 2, 3: 3 };
  for (const l of LESSONS) {
    for (const s of l.writing.samples) {
      const r = Core.checkWriting(s, { ...l.writing, minSentences: minSentences[l.level] });
      assert.ok(r.passed, `Day ${l.id}: ${s}\n${JSON.stringify(r.checks)}`);
    }
  }
});

test("작문 체크가 흔한 실수를 잡아냄", () => {
  const w = { minWords: 4, require: ["can i get"] };
  assert.equal(Core.checkWriting("can i get a coffee", w).passed, false);
  const r = Core.checkWriting("i want coffee please.", w);
  assert.equal(r.checks.find((c) => c.label.includes("패턴")).ok, false);
  assert.equal(r.checks.find((c) => c.label.includes("'I'")).ok, false);
  assert.equal(Core.checkWriting("Can I get a coffee?", w).passed, true);
  assert.equal(Core.checkWriting("I’d like to go hiking with friends.", { minWords: 5, require: ["i'd like to"] }).passed, true);
});

test("연속 학습일", () => {
  const s = Core.defaultState();
  Core.markStudied(s, "2026-10-01");
  Core.markStudied(s, "2026-10-01");
  assert.equal(s.streak, 1);
  Core.markStudied(s, "2026-10-02");
  assert.equal(s.streak, 2);
  assert.equal(Core.currentStreak(s, "2026-10-03"), 2);
  assert.equal(Core.currentStreak(s, "2026-10-04"), 0);
  Core.markStudied(s, "2026-10-05");
  assert.equal(s.streak, 1);
});

test("간격 반복 카드", () => {
  const s = Core.defaultState();
  Core.addCards(s, LESSONS[0], "2026-10-01");
  assert.equal(Object.keys(s.cards).length, 10);
  assert.equal(Core.dueCards(s, LESSONS, "2026-10-01").length, 0);
  const due = Core.dueCards(s, LESSONS, "2026-10-02");
  assert.equal(due.length, 10);
  assert.equal(due[0].en, LESSONS[0].sentences[0].en);
  let c = Core.gradeCard(s.cards[due[0].id], "good", "2026-10-02");
  assert.deepEqual({ ...c }, { step: 1, due: "2026-10-05" });
  c = Core.gradeCard(c, "again", "2026-10-05");
  assert.deepEqual({ ...c }, { step: 0, due: "2026-10-06" });
  assert.equal(Core.gradeCard({ step: 5, due: "" }, "easy", "2026-10-01").step, 5);
});

test("문장 조립 비교와 섞기", () => {
  assert.ok(Core.sameSentence("Can I get a cafe latte?", "can i get a cafe latte"));
  assert.ok(!Core.sameSentence("I get can a cafe latte?", "Can I get a cafe latte?"));
  const arr = [0, 1, 2, 3];
  for (let i = 0; i < 20; i++) {
    const out = Core.shuffled(arr);
    assert.notDeepEqual(out, arr);
    assert.deepEqual([...out].sort(), arr);
  }
});

test("말하기 유사도", () => {
  assert.equal(Core.similarity("Could you say that again?", "could you say that again"), 1);
  assert.ok(Core.similarity("Could you say that again?", "could you say again") < 1);
});


test("대사 감정 추정", () => {
  assert.equal(Core.toneOf("I'm so stoked!").name, "excited");
  assert.equal(Core.toneOf("Sorry to bother you.").name, "sorry");
  assert.equal(Core.toneOf("Are you free this Friday?").name, "question");
  assert.equal(Core.toneOf("I usually get up at seven.").name, "calm");
  assert.equal(Core.toneOf("I’m worried about the exam!").name, "sorry");
});

// ---------- 카카오톡 알림 일정 ----------
// 2026-10-19는 월요일. 날짜는 모두 로컬 시각.
const at = (d, hm) => {
  const [y, m, dd] = d.split("-").map(Number);
  const [hh, mi] = hm.split(":").map(Number);
  return new Date(y, m - 1, dd, hh, mi);
};
// vm 안에서 만든 Date는 다른 realm이라 시각(ms)으로 비교
const sameTime = (a, b, msg) => assert.equal(a ? a.getTime() : a, b ? b.getTime() : b, msg);
const kakao = (o) => ({ ...Core.defaultKakao(), enabled: true, ...o });

test("시각 형식 검사", () => {
  for (const t of ["00:00", "08:05", "23:59"]) assert.ok(Core.validTime(t), t);
  for (const t of ["24:00", "8:00", "12:60", "", null, "ab:cd"]) assert.ok(!Core.validTime(t), String(t));
});

test("daily: 여러 시각 중 다음 시각", () => {
  const s = kakao({ times: ["21:00", "08:00", "12:30", "bad"] });
  sameTime(Core.nextFire(s, at("2026-10-19", "07:00")), at("2026-10-19", "08:00"));
  sameTime(Core.nextFire(s, at("2026-10-19", "08:00")), at("2026-10-19", "12:30"));
  sameTime(Core.nextFire(s, at("2026-10-19", "13:00")), at("2026-10-19", "21:00"));
});

test("daily: 자정 넘김과 요일 건너뛰기", () => {
  const s = kakao({ times: ["08:00"] });
  sameTime(Core.nextFire(s, at("2026-10-19", "22:00")), at("2026-10-20", "08:00"));
  // 평일만: 금요일 밤 → 월요일 아침
  const weekdays = kakao({ times: ["08:00"], days: [1, 2, 3, 4, 5] });
  sameTime(Core.nextFire(weekdays, at("2026-10-23", "09:00")), at("2026-10-26", "08:00"));
  // 토요일만
  sameTime(Core.nextFire(kakao({ times: ["10:00"], days: [6] }), at("2026-10-19", "12:00")), at("2026-10-24", "10:00"));
});

test("빈 목록·꺼짐은 null", () => {
  const now = at("2026-10-19", "12:00");
  assert.equal(Core.nextFire(kakao({ times: [] }), now), null);
  assert.equal(Core.nextFire(kakao({ days: [] }), now), null);
  assert.equal(Core.nextFire({ ...kakao({}), enabled: false }, now), null);
  assert.equal(Core.dueFire({ ...kakao({}), enabled: false }, at("2026-10-19", "08:01")), null);
});

test("interval: 시간대 경계", () => {
  const s = kakao({ mode: "interval", every: 60, from: "09:00", to: "22:00" });
  sameTime(Core.nextFire(s, at("2026-10-19", "06:00")), at("2026-10-19", "09:00"));
  sameTime(Core.nextFire(s, at("2026-10-19", "09:00")), at("2026-10-19", "10:00"));
  sameTime(Core.nextFire(s, at("2026-10-19", "21:30")), at("2026-10-19", "22:00"));
  sameTime(Core.nextFire(s, at("2026-10-19", "22:00")), at("2026-10-20", "09:00"));
  // 간격이 끝 시각에 딱 맞지 않으면 끝 시각을 넘기지 않는다
  const odd = kakao({ mode: "interval", every: 50, from: "09:00", to: "10:30" });
  sameTime(Core.nextFire(odd, at("2026-10-19", "09:10")), at("2026-10-19", "09:50"));
  sameTime(Core.nextFire(odd, at("2026-10-19", "09:55")), at("2026-10-20", "09:00"));
  // 15분보다 짧은 간격은 15분으로
  const fast = kakao({ mode: "interval", every: 1, from: "09:00", to: "10:00" });
  sameTime(Core.nextFire(fast, at("2026-10-19", "09:00")), at("2026-10-19", "09:15"));
  // 자정을 넘는 시간대 (22:00 ~ 01:00), 시작한 날의 요일 기준
  const night = kakao({ mode: "interval", every: 60, from: "22:00", to: "01:00", days: [1] });
  sameTime(Core.nextFire(night, at("2026-10-19", "23:30")), at("2026-10-20", "00:00"));
  sameTime(Core.nextFire(night, at("2026-10-20", "01:00")), at("2026-10-26", "22:00"));
});

test("dueFire: 지금 보낼 시각, 중복 전송 방지, grace 초과", () => {
  const s = kakao({ times: ["08:00", "21:00"] });
  assert.equal(Core.dueFire(s, at("2026-10-19", "07:59")), null);
  const due = Core.dueFire(s, at("2026-10-19", "08:00"));
  sameTime(due, at("2026-10-19", "08:00"));
  sameTime(Core.dueFire(s, at("2026-10-19", "08:14")), due);
  // 이미 보냈으면 다시 보내지 않음
  s.lastSent = due.getTime();
  assert.equal(Core.dueFire(s, at("2026-10-19", "08:05")), null);
  // 너무 오래 놓친 것은 건너뜀 (기본 15분, 지정 가능)
  const t = kakao({ times: ["08:00"] });
  assert.equal(Core.dueFire(t, at("2026-10-19", "08:16")), null);
  sameTime(Core.dueFire(t, at("2026-10-19", "08:16"), 30), at("2026-10-19", "08:00"));
  // 어제 밤 시각은 lastSent가 있어도 오늘 아침 시각은 보냄
  const u = kakao({ times: ["08:00", "23:55"], lastSent: at("2026-10-18", "23:55").getTime() });
  sameTime(Core.dueFire(u, at("2026-10-19", "08:01")), at("2026-10-19", "08:00"));
  // 자정 직후: 어제 23:55 예정분
  const v = kakao({ times: ["23:55"] });
  sameTime(Core.dueFire(v, at("2026-10-20", "00:05")), at("2026-10-19", "23:55"));
});

test("다음 알림 표시 문구", () => {
  const now = at("2026-10-19", "18:47");
  assert.equal(Core.describeFire(at("2026-10-19", "21:00"), now), "오늘 21:00 (2시간 13분 후)");
  assert.equal(Core.describeFire(at("2026-10-20", "08:00"), now), "내일 08:00 (13시간 13분 후)");
  assert.equal(Core.describeFire(at("2026-10-23", "08:00"), now), "10/23(금) 08:00 (3일 13시간 후)");
  assert.equal(Core.describeFire(new Date(now.getTime() + 90000), now), "오늘 18:48 (1분 30초 후)");
});

test("카카오 메시지와 문장 고르기", () => {
  const url = "https://example.com/ten/";
  const m = Core.kakaoMessage(LESSONS[0].sentences[0], url);
  assert.equal(m.object_type, "text");
  assert.ok(m.text.includes(LESSONS[0].sentences[0].en) && m.text.includes(LESSONS[0].sentences[0].ko));
  assert.ok(m.text.length <= 200);
  assert.equal(m.link.web_url, url);
  assert.equal(m.button_title, "오늘 10분 시작하기");
  assert.ok(Core.kakaoMessage(LESSONS[0], url).text.includes(LESSONS[0].sentences[0].en));
  const long = Core.kakaoMessage({ en: "a ".repeat(300), ko: "가".repeat(300) }, url);
  assert.ok(long.text.length <= 200);
  for (const l of LESSONS) for (const s of l.sentences) assert.ok(Core.kakaoMessage(s, url).text.length <= 200);

  const st = Core.defaultState();
  st.completed = [1];
  const pick = Core.pickSentence(LESSONS, st, at("2026-10-19", "08:00"));
  assert.ok(LESSONS[1].sentences.includes(pick), "다음 레슨 문장");
  assert.notDeepEqual(pick, Core.pickSentence(LESSONS, st, at("2026-10-19", "08:01")));
  assert.ok(Core.pickSentence(LESSONS, null, new Date()).en);
});

test("예전 저장 상태에 카톡 설정 기본값 병합", () => {
  const s = Core.mergeState({ completed: [1], settings: { rate: 1.1 } });
  assert.equal(s.settings.rate, 1.1);
  assert.deepEqual({ ...s.settings.kakao, times: [...s.settings.kakao.times], days: [...s.settings.kakao.days] }, { ...Core.defaultKakao(), times: ["08:00", "21:00"], days: [0, 1, 2, 3, 4, 5, 6] });
  assert.deepEqual([...s.completed], [1]);
  const t = Core.mergeState({ settings: { kakao: { enabled: true, times: ["07:30"] } } });
  assert.equal(t.settings.rate, 0.9);
  assert.equal(t.settings.kakao.enabled, true);
  assert.deepEqual([...t.settings.kakao.times], ["07:30"]);
  assert.equal(t.settings.kakao.mode, "daily");
});
