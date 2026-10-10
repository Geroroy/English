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
