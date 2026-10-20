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
      settings: { rate: 0.9, kakao: defaultKakao() }
    };
  }

  // 저장된 상태에 새로 생긴 설정 키(기본값)를 채워 넣는다. 예전 사용자의 settings에는 kakao가 없을 수 있다.
  function mergeState(saved) {
    const base = defaultState();
    const out = Object.assign(base, saved || {});
    const settings = saved && saved.settings && typeof saved.settings === "object" ? saved.settings : {};
    out.settings = Object.assign(defaultState().settings, settings);
    out.settings.kakao = Object.assign(defaultKakao(), settings.kakao && typeof settings.kakao === "object" ? settings.kakao : {});
    return out;
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

  // ---------- 카카오톡 학습 알림 일정 ----------
  // mode "daily": times(HH:MM) 시각마다 / "interval": from~to 사이에 every분마다. days: 보낼 요일(0=일).
  // lastSent: 마지막으로 보낸 '예정 시각'(ms). 같은 예정 시각을 두 번 보내지 않는 데 쓴다.
  const MIN_EVERY = 15;
  function defaultKakao() {
    return {
      enabled: false,
      mode: "daily",
      times: ["08:00", "21:00"],
      days: [0, 1, 2, 3, 4, 5, 6],
      every: 60,
      from: "09:00",
      to: "22:00",
      lastSent: null
    };
  }

  function validTime(s) {
    return typeof s === "string" && /^([01]\d|2[0-3]):[0-5]\d$/.test(s);
  }

  function toMinutes(s) {
    const [hh, mm] = s.split(":").map(Number);
    return hh * 60 + mm;
  }

  // 그 날(자정 기준 date)에 시작하는 예정 시각들. interval에서 to < from이면 자정을 넘겨 다음 날 to까지.
  function slotsOn(schedule, date) {
    const days = Array.isArray(schedule.days) ? schedule.days : [];
    if (!days.includes(date.getDay())) return [];
    let mins = [];
    if (schedule.mode === "interval") {
      if (!validTime(schedule.from) || !validTime(schedule.to)) return [];
      const every = Math.max(MIN_EVERY, Math.round(Number(schedule.every)) || 60);
      const start = toMinutes(schedule.from);
      let end = toMinutes(schedule.to);
      if (end < start) end += 24 * 60;
      for (let m = start; m <= end; m += every) mins.push(m);
    } else {
      mins = [...new Set((schedule.times || []).filter(validTime).map(toMinutes))].sort((a, b) => a - b);
    }
    // Date 생성자가 24:00 이상을 다음 날로 넘겨 준다
    return mins.map((m) => new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, m));
  }

  // 기준 시각 주변(어제~8일 뒤)의 예정 시각을 오름차순으로
  function slotsAround(schedule, now) {
    const out = [];
    for (let k = -1; k <= 8; k++) {
      out.push(...slotsOn(schedule, new Date(now.getFullYear(), now.getMonth(), now.getDate() + k)));
    }
    return out.sort((a, b) => a - b);
  }

  // 다음 전송 시각 (now보다 뒤). 꺼져 있거나 보낼 시각·요일이 없으면 null.
  function nextFire(schedule, now = new Date()) {
    if (!schedule || schedule.enabled === false) return null;
    return slotsAround(schedule, now).find((d) => d > now) || null;
  }

  // 지금 보내야 할 예정 시각: 이미 지났지만 graceMin분 안이고, 아직 보내지 않은 가장 최근 시각.
  function dueFire(schedule, now = new Date(), graceMin = 15) {
    if (!schedule || schedule.enabled === false) return null;
    const last = schedule.lastSent == null ? -Infinity : Number(schedule.lastSent);
    const past = slotsAround(schedule, now).filter((d) => d <= now);
    const latest = past[past.length - 1];
    if (!latest || now - latest > graceMin * 60000 || latest.getTime() <= last) return null;
    return latest;
  }

  // "오늘 21:00 (2시간 13분 후)"처럼 다음 알림 시각을 사람이 읽기 쉽게
  const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];
  function describeFire(when, now = new Date()) {
    const hm = `${String(when.getHours()).padStart(2, "0")}:${String(when.getMinutes()).padStart(2, "0")}`;
    const dd = daysBetween(todayStr(now), todayStr(when));
    const day = dd === 0 ? "오늘" : dd === 1 ? "내일" : `${when.getMonth() + 1}/${when.getDate()}(${WEEKDAYS[when.getDay()]})`;
    const sec = Math.max(0, Math.ceil((when - now) / 1000));
    const d = Math.floor(sec / 86400);
    const hh = Math.floor((sec % 86400) / 3600);
    const mm = Math.floor((sec % 3600) / 60);
    const left =
      d > 0 ? `${d}일 ${hh}시간 후` : hh > 0 ? `${hh}시간 ${mm}분 후` : mm > 0 ? `${mm}분 ${sec % 60}초 후` : `${sec}초 후`;
    return `${day} ${hm} (${left})`;
  }

  // 알림에 넣을 한 문장: 다음에 배울 레슨 문장, 다 배웠다면 오늘 복습 문장, 기록이 없으면 전체 문장 중 하나.
  // when(예정 시각)에 따라 문장이 돌아가므로 같은 날 여러 번 받아도 매번 다른 문장이 온다.
  function pickSentence(lessons, state, when = new Date()) {
    const slot = Math.floor(when.getTime() / 60000);
    let pool = [];
    if (state) {
      const next = nextLesson(state, lessons);
      if (next) pool = next.sentences;
      else pool = dueCards(state, lessons, todayStr(when));
    }
    if (!pool.length) pool = lessons.flatMap((l) => l.sentences);
    return pool.length ? pool[((slot % pool.length) + pool.length) % pool.length] : null;
  }

  // 카카오톡 '나에게 보내기' 텍스트 템플릿 (text는 카카오 제한인 200자 이내)
  function kakaoMessage(item, url) {
    const s = item && item.sentences ? item.sentences[0] : item;
    const cut = (t, n) => (t.length > n ? t.slice(0, n - 1) + "…" : t);
    const head = "[The Ten Minutes] 오늘의 한 문장";
    const tail = "오늘 10분, 지금 시작해 볼까요?";
    let text = head + "\n\n";
    if (s && s.en) text += `${cut(s.en, 90)}\n${cut(s.ko || "", 60)}\n\n`;
    text = cut(text + tail, 200);
    const link = url ? { web_url: url, mobile_web_url: url } : {};
    return { object_type: "text", text, link, button_title: "오늘 10분 시작하기" };
  }

  root.Core = {
    INTERVALS,
    MIN_EVERY,
    defaultKakao,
    validTime,
    nextFire,
    dueFire,
    describeFire,
    pickSentence,
    kakaoMessage,
    todayStr,
    addDays,
    daysBetween,
    defaultState,
    mergeState,
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
