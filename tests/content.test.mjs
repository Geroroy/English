// 레벨 설정과 레벨별 콘텐츠의 형식 검사
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const ctx = {};
vm.createContext(ctx);
for (const f of ["js/config.js", "js/content/private.js", "js/content/pfc.js", "js/content/corporal.js", "js/content/sergeant.js"]) {
  vm.runInContext(readFileSync(new URL(`../${f}`, import.meta.url), "utf8"), ctx);
}
const { LEVELS, CONTENT, FEATURES } = ctx;

function checkQuiz(items, where) {
  for (const q of items) {
    assert.ok(q.q && Array.isArray(q.choices) && q.choices.length >= 2, `${where}: 퀴즈 형식`);
    assert.ok(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.choices.length, `${where}: 정답 번호 ${q.answer}`);
  }
}

test("레벨 정의", () => {
  assert.equal(LEVELS.length, 4);
  assert.equal(LEVELS.map((l) => l.id).join(","), "private,pfc,corporal,sergeant");
  assert.equal(typeof FEATURES.tenMinutes, "boolean");
  for (const l of LEVELS) {
    assert.ok(l.name && l.cefr && l.tagline && l.modules.length);
    for (const m of l.modules) {
      assert.ok(["lesson", "reading", "rush", "tenMinutes"].includes(m.type), `${l.id}.${m.key} type`);
      if (m.type === "tenMinutes") assert.ok(Array.isArray(m.lessonRange) && m.lessonRange[0] <= m.lessonRange[1], `${l.id}: lessonRange`);
      else assert.ok(CONTENT[l.id] && CONTENT[l.id][m.key] !== undefined, `${l.id}.${m.key} 콘텐츠 없음`);
    }
  }
});

test("10분 코스 Day 범위가 계급 순서대로 빈틈없이 이어짐", () => {
  const ranges = LEVELS.map((l) => l.modules.find((m) => m.type === "tenMinutes").lessonRange);
  assert.equal(ranges[0][0], 1);
  for (let i = 1; i < ranges.length; i++) assert.equal(ranges[i][0], ranges[i - 1][1] + 1);
});

test("단원·리딩·단어 러쉬 형식", () => {
  for (const l of LEVELS) {
    for (const m of l.modules) {
      const data = (CONTENT[l.id] || {})[m.key];
      const where = `${l.id}.${m.key}`;
      if (m.type === "lesson") {
        const ids = new Set();
        for (const u of data) {
          assert.ok(u.id && u.title && Array.isArray(u.sections), `${where}: 단원 ${u.id}`);
          assert.ok(!ids.has(u.id), `${where}: 중복 id ${u.id}`);
          ids.add(u.id);
          for (const s of u.sections) {
            assert.ok(["text", "examples", "pairs", "table", "quiz"].includes(s.type), `${where}.${u.id}: section type ${s.type}`);
            if (s.type === "examples") for (const x of s.items) assert.ok(x.en && x.ko, `${where}.${u.id}: 예문`);
            if (s.type === "pairs") for (const x of s.items) assert.ok(x.a && x.b, `${where}.${u.id}: 짝`);
            if (s.type === "table") for (const r of s.rows) assert.equal(r.length, s.head.length, `${where}.${u.id}: 표 열 수`);
            if (s.type === "quiz") checkQuiz(s.items, `${where}.${u.id}`);
          }
        }
      } else if (m.type === "reading") {
        for (const r of data) {
          assert.ok(r.id && r.title && r.cefr && r.paragraphs.length, `${where}: 리딩 ${r.id}`);
          checkQuiz(r.questions || [], `${where}.${r.id}`);
        }
      } else if (m.type === "rush") {
        assert.ok(data.seconds > 0 && data.words.length >= 4, `${where}: 단어 4개 이상`);
        for (const w of data.words) assert.ok(w.en && w.ko);
      }
    }
  }
});
