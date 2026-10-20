// UI와 분리된 순수 로직: 날짜, 연속 학습(streak), 간격 반복(SRS), 작문 체크
(function (root) {
  const DAY_MS = 24 * 60 * 60 * 1000;
  // 복습 간격(일). 맞힐 때마다 다음 단계로 이동.
  const INTERVALS = [1, 3, 7, 14, 30, 60];

  function todayStr(date = new Date()) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  function parseDay(str) {
    const [y, m, d] = str.split("-").map(Number);
    return new Date(y, m - 1, d);
  }

  function addDays(str, n) {
    const d = parseDay(str);
    d.setDate(d.getDate() + n);
    return todayStr(d);
  }

  function daysBetween(a, b) {
    return Math.round((parseDay(b) - parseDay(a)) / DAY_MS);
  }

  function defaultState() {
    return {
      completed: [], // 완료한 레슨 id
      cards: {}, // 복습 카드: id -> { due, step }
      streak: 0,
      lastStudy: null, // 마지막 학습 날짜
      history: {}, // 날짜 -> 학습한 초
      journal: [], // 작문 기록
      level: "private", // 지금 보고 있는 계급(레벨) id
      rank: "private", // 진급으로 얻은 현재 계급 id
      discharged: false, // 병장까지 마치면 true
      modules: {}, // "계급.모듈" -> { done: [단원 id], best: 점수 }
      settings: { rate: 0.9 }
    };
  }

  // 오늘 학습을 마쳤을 때 연속 학습일 갱신
  function markStudied(state, today) {
    if (state.lastStudy === today) return state;
    const gap = state.lastStudy ? daysBetween(state.lastStudy, today) : null;
    state.streak = gap === 1 ? state.streak + 1 : 1;
    state.lastStudy = today;
    return state;
  }

  // 어제도 오늘도 공부하지 않았다면 화면상 연속 기록은 0
  function currentStreak(state, today) {
    if (!state.lastStudy) return 0;
    return daysBetween(state.lastStudy, today) <= 1 ? state.streak : 0;
  }

  function sentenceId(lesson, i) {
    return `${lesson.id}-s${i}`;
  }

  // 문장 만들기에 쓸 오늘 문장 3개: 원어민 표현을 하나 넣고, 섞을 수 있게 3단어 이상인 문장만
  const DRILL_ORDER = [2, 7, 8, 3, 5, 6, 4, 1, 0, 9];
  function drillSentences(lesson) {
    return DRILL_ORDER.map((k) => lesson.sentences[k])
      .filter((x) => x && tokenize(x.en).length >= 3)
      .slice(0, 3);
  }

  function addCards(state, lesson, today) {
    lesson.sentences.forEach((_, i) => {
      const id = sentenceId(lesson, i);
      if (!state.cards[id]) state.cards[id] = { due: addDays(today, 1), step: 0 };
    });
    return state;
  }

  // grade: "again" | "good" | "easy"
  function gradeCard(card, grade, today) {
    let step = card.step;
    if (grade === "again") step = 0;
    else if (grade === "good") step = Math.min(step + 1, INTERVALS.length - 1);
    else step = Math.min(step + 2, INTERVALS.length - 1);
    const days = grade === "again" ? 1 : INTERVALS[step];
    return { step, due: addDays(today, days) };
  }

  function lookupCard(lessons, id) {
    const m = /^(\d+)-s(\d+)$/.exec(id);
    if (!m) return null; // 예전 형식 카드는 건너뜀
    const lesson = lessons.find((l) => l.id === Number(m[1]));
    const item = lesson && lesson.sentences[Number(m[2])];
    return item ? { ...item, id, lessonId: lesson.id } : null;
  }

  function dueCards(state, lessons, today, limit = Infinity) {
    return Object.entries(state.cards)
      .filter(([, c]) => c.due <= today)
      .sort((a, b) => (a[1].due < b[1].due ? -1 : a[1].due > b[1].due ? 1 : 0))
      .map(([id]) => lookupCard(lessons, id))
      .filter(Boolean)
      .slice(0, limit);
  }

  function nextLesson(state, lessons) {
    return lessons.find((l) => !state.completed.includes(l.id)) || null;
  }

  function normalizeText(s) {
    return s
      .replace(/[‘’]/g, "'")
      .replace(/[“”]/g, '"')
      .replace(/\s+/g, " ")
      .trim();
  }

  function words(s) {
    return normalizeText(s)
      .toLowerCase()
      .replace(/[^a-z0-9' ]/g, " ")
      .split(" ")
      .filter(Boolean);
  }

  function countSentences(s) {
    return normalizeText(s)
      .split(/[.!?]+/)
      .filter((x) => x.trim().split(" ").filter(Boolean).length >= 2).length;
  }

  // 작문 자가 점검. 정답 하나를 강요하지 않고, 기본 규칙과 목표 패턴 사용 여부를 확인.
  function checkWriting(text, writing) {
    const t = normalizeText(text);
    const wc = words(t).length;
    const checks = [];
    const minWords = writing.minWords || 5;
    checks.push({ ok: wc >= minWords, label: `${minWords}단어 이상 쓰기 (지금 ${wc}단어)` });

    if (writing.require && writing.require.length) {
      const lower = t.toLowerCase();
      const ok = writing.require.some((p) => new RegExp(p, "i").test(lower));
      checks.push({ ok, label: "오늘의 패턴 사용하기" });
    }

    const sentences = t.split(/(?<=[.!?])\s+/).filter(Boolean);
    checks.push({
      ok: sentences.length > 0 && sentences.every((s) => /^["'(]?[A-Z0-9]/.test(s)),
      label: "문장을 대문자로 시작하기"
    });
    checks.push({ ok: /[.!?]["')]?$/.test(t), label: "마침표·물음표로 끝맺기" });
    checks.push({ ok: !/(^|[^a-zA-Z'])i([ ']|$)/.test(t), label: "'I'는 항상 대문자로 쓰기" });

    const minSentences = writing.minSentences || 0;
    if (minSentences > 1) {
      const n = countSentences(t);
      checks.push({ ok: n >= minSentences, label: `${minSentences}문장 이상 쓰기 (지금 ${n}문장)` });
    }

    return { checks, passed: checks.every((c) => c.ok), wordCount: wc };
  }

  // 말하기 연습용 유사도 (0~1): 목표 문장의 단어 중 몇 개를 맞혔는지
  // 대사 감정 추정 (규칙 기반): 어떤 문장이든 말투(빠르기·음높이)를 정한다.
  // speed: 말 빠르기 배수, pitch: 반음 단위 음높이 변화
  const TONES = {
    excited: { speed: 1.08, pitch: 1.2 },
    sorry: { speed: 0.88, pitch: -0.8 },
    question: { speed: 1.0, pitch: 0.4 },
    calm: { speed: 0.95, pitch: 0 }
  };
  const SORRY_WORDS = /\b(sorry|worried|nervous|afraid|unfortunately|problem|sick|tired|bad|butterflies|bother|late|lonely|died|broken|stress(ed)?|headache|miss(ed)?)\b/i;
  const EXCITED_WORDS = /\b(stoked|excited|awesome|amazing|great|nice|love|blast|fun|can't wait|congrat\w*|wow|perfect|best)\b/i;
  function toneOf(text) {
    const t = normalizeText(text);
    let name = "calm";
    if (SORRY_WORDS.test(t)) name = "sorry";
    else if (/!/.test(t) || EXCITED_WORDS.test(t)) name = "excited";
    else if (/\?$/.test(t)) name = "question";
    return { name, ...TONES[name] };
  }

  function similarity(target, said) {
    const t = words(target);
    const s = words(said);
    if (!t.length) return 0;
    const pool = [...s];
    let hit = 0;
    for (const w of t) {
      const i = pool.indexOf(w);
      if (i >= 0) {
        hit++;
        pool.splice(i, 1);
      }
    }
    return hit / Math.max(t.length, s.length);
  }

  function tokenize(sentence) {
    return normalizeText(sentence).split(" ");
  }

  function sameSentence(a, b) {
    return words(a).join(" ") === words(b).join(" ");
  }

  function shuffled(arr, rand = Math.random) {
    if (arr.length < 2) return [...arr];
    let out;
    do {
      out = [...arr];
      for (let i = out.length - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1));
        [out[i], out[j]] = [out[j], out[i]];
      }
    } while (out.join(" ") === arr.join(" "));
    return out;
  }

  root.Core = {
    INTERVALS,
    todayStr,
    addDays,
    daysBetween,
    defaultState,
    markStudied,
    currentStreak,
    sentenceId,
    drillSentences,
    addCards,
    gradeCard,
    lookupCard,
    dueCards,
    nextLesson,
    normalizeText,
    words,
    countSentences,
    checkWriting,
    similarity,
    toneOf,
    tokenize,
    sameSentence,
    shuffled
  };
})(globalThis);
