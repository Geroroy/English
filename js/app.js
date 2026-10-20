(function () {
  const { Core, LESSONS, FREE_PROMPTS } = globalThis;
  const SCENES = globalThis.SCENES || { photos: {} };
  const AUDIO = globalThis.AUDIO || {};
  const STORAGE_KEY = "ten-min-english-v1";
  const SESSION_SECONDS = 10 * 60;
  const REVIEW_LIMIT = 6;
  const LEVEL_NAMES = { 1: "한 문장 쓰기", 2: "2~3문장 연결하기", 3: "짧은 단락 쓰기", 4: "자유 작문" };
  const MIN_SENTENCES = { 1: 1, 2: 2, 3: 3, 4: 4 };

  const view = document.getElementById("view");
  const timerEl = document.getElementById("timer");
  const streakEl = document.getElementById("streak");

  // ---------- 저장 ----------
  const OLD_LEVEL_IDS = { beginner: "private", intermediate: "corporal", advanced: "sergeant" }; // 예전 3레벨 저장값 옮기기
  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const s = Object.assign(Core.defaultState(), JSON.parse(raw));
        s.level = OLD_LEVEL_IDS[s.level] || s.level;
        s.rank = OLD_LEVEL_IDS[s.rank] || s.rank;
        return s;
      }
    } catch (e) {
      /* 저장소 사용 불가 시 기본값 */
    }
    return Core.defaultState();
  }
  let state = load();
  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      /* 무시 */
    }
    renderStreak();
  }
  const today = () => Core.todayStr();

  // ---------- 유틸 ----------
  function h(tag, attrs = {}, ...children) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v == null || v === false) continue;
      if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
      else if (k === "class") el.className = v;
      else if (k === "html") el.innerHTML = v;
      else el.setAttribute(k, v === true ? "" : v);
    }
    for (const c of children.flat()) {
      if (c == null || c === false) continue;
      el.append(c.nodeType ? c : document.createTextNode(String(c)));
    }
    return el;
  }
  // 선 아이콘 (이모지 대신 사용)
  const ICONS = {
    speaker: '<path d="M4 9.5h3.2L12 5.5v13l-4.8-4H4z"/><path d="M15.5 9a4.2 4.2 0 0 1 0 6"/><path d="M18 6.5a7.8 7.8 0 0 1 0 11"/>',
    mic: '<rect x="9" y="3.5" width="6" height="11" rx="3"/><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0"/><path d="M12 18v2.5"/>',
    note: '<path d="M6 3.5h9l3 3v14H6z"/><path d="M15 3.5v3h3"/><path d="M9 11h6M9 14h6M9 17h4"/>',
    home: '<path d="M3 9.5 12 4l9 5.5"/><path d="M4.5 9.5h15"/><path d="M6.5 12v6M10.2 12v6M13.8 12v6M17.5 12v6"/><path d="M3.5 20.5h17"/>',
    review: '<path d="M19.5 10.5A7.5 7.5 0 0 0 6 6.3L4.5 8"/><path d="M4.5 4v4h4"/><path d="M4.5 13.5A7.5 7.5 0 0 0 18 17.7l1.5-1.7"/><path d="M19.5 20v-4h-4"/>',
    pen: '<path d="M12 3.5l5 7-3 7.5h-4l-3-7.5z"/><path d="M12 3.5v7"/><circle cx="12" cy="11.8" r="1.1"/><path d="M10 18v2.5h4V18"/>',
    chart: '<path d="M4 20h16"/><path d="M6 16l4-5 3 3 5-7"/>',
    arrow: '<path d="M5 12h14"/><path d="M13 6l6 6-6 6"/>',
    left: '<path d="M15 5l-7 7 7 7"/>',
    right: '<path d="M9 5l7 7-7 7"/>',
    camera: '<path d="M3.5 8h3.2l1.6-2.5h7.4L17.3 8h3.2v11h-17z"/><circle cx="12" cy="13.5" r="3.5"/>',
    flame: '<path d="M12 21c-3.9 0-6.5-2.6-6.5-6 0-4 3.5-5.5 4-10 3 1.8 4.5 4.3 4.5 6.5 1-.6 1.6-1.6 2-2.8 1.6 1.6 2.5 3.6 2.5 6.3 0 3.4-2.6 6-6.5 6z"/>',
    copy: '<rect x="8" y="8" width="12" height="12" rx="1"/><path d="M16 8V4H4v12h4"/>',
    play: '<path d="M7.5 5v14l11-7z"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7"/>',
    down: '<path d="M6 9.5l6 6 6-6"/>',
    abc: '<path d="M3.5 16.5l3-9 3 9"/><path d="M4.6 13.5h3.8"/><path d="M12.5 7.5h3.2a2.2 2.2 0 0 1 0 4.4h-3.2zM12.5 11.9h3.6a2.3 2.3 0 0 1 0 4.6h-3.6z"/><path d="M12.5 7.5v9"/><path d="M20.5 9a2.5 2.5 0 0 0-2.3 1.7 4 4 0 0 0 0 2.6 2.5 2.5 0 0 0 2.3 1.7"/>',
    grid: '<rect x="4" y="4" width="6.5" height="6.5"/><rect x="13.5" y="4" width="6.5" height="6.5"/><rect x="4" y="13.5" width="6.5" height="6.5"/><rect x="13.5" y="13.5" width="6.5" height="6.5"/>',
    book: '<path d="M4 5.5a2 2 0 0 1 2-2h6v16H6a2 2 0 0 0-2 2z"/><path d="M20 5.5a2 2 0 0 0-2-2h-6v16h6a2 2 0 0 1 2 2z"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    bolt: '<path d="M13 3 5 13.5h6L10.5 21 19 10.5h-6z"/>',
    chat: '<path d="M4 5.5h16v10H9l-4 3.5v-3.5H4z"/><path d="M8 9h8M8 12h5"/>',
    spark: '<path d="M12 3.5v5M12 15.5v5M3.5 12h5M15.5 12h5"/><path d="M6.5 6.5l3 3M14.5 14.5l3 3M6.5 17.5l3-3M14.5 9.5l3-3"/>'
  };
  function icon(name) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("class", "ico");
    svg.setAttribute("aria-hidden", "true");
    svg.innerHTML = ICONS[name];
    return svg;
  }
  function heading(eyebrow, title, sub) {
    return h("header", { class: "heading" }, h("p", { class: "eyebrow" }, eyebrow), h("h2", {}, title), sub ? h("p", { class: "muted" }, sub) : null);
  }

  function mount(...nodes) {
    view.replaceChildren(...nodes.flat(Infinity).filter((n) => n != null && n !== false));
    window.scrollTo(0, 0);
  }
  // 화면 안 확인 창 (임베드 환경에서는 confirm/alert가 막혀 있음)
  function ask(message, okLabel = "확인", danger = false) {
    return new Promise((resolve) => {
      const close = (v) => {
        overlay.remove();
        resolve(v);
      };
      const overlay = h(
        "div",
        { class: "overlay", onclick: (e) => e.target === overlay && close(false) },
        h(
          "div",
          { class: "dialog", role: "dialog", "aria-modal": "true" },
          h("p", {}, message),
          h(
            "div",
            { class: "row gap end" },
            h("button", { class: "btn", onclick: () => close(false) }, "취소"),
            h("button", { class: "btn primary" + (danger ? " danger" : ""), onclick: () => close(true) }, okLabel)
          )
        )
      );
      document.body.append(overlay);
      overlay.querySelector(".btn.primary").focus();
    });
  }
  function toast(message) {
    const el = h("div", { class: "toast", role: "status" }, message);
    document.body.append(el);
    setTimeout(() => el.remove(), 2200);
  }

  function renderStreak() {
    streakEl.replaceChildren(icon("flame"), h("span", {}, `${Core.currentStreak(state, today())}일`));
  }

  // ---------- 음성 ----------
  // 1순위: 미리 녹음한 음성(audio/*.mp3, OpenAI 감정 연기 또는 Kokoro). 2순위: 브라우저 음성 중 가장 자연스러운 것.
  // 녹음에 쓴 목소리 이름 (js/audio.js가 알려 줌. 없으면 Kokoro 기본값)
  const VOICES = globalThis.AUDIO_VOICES || { main: "af_heart", A: "am_michael", B: "af_heart" };
  const synth = window.speechSynthesis;
  let voice = null;
  let currentAudio = null;
  function pickVoice() {
    if (!synth) return;
    const voices = synth.getVoices().filter((v) => /^en[-_]/i.test(v.lang));
    const score = (v) =>
      (/natural|neural|online/i.test(v.name) ? 8 : 0) +
      (/enhanced|premium/i.test(v.name) ? 6 : 0) +
      (/google us english|samantha|ava|aria|jenny/i.test(v.name) ? 4 : 0) +
      (/en[-_]US/i.test(v.lang) ? 2 : 0);
    voice = voices.sort((a, b) => score(b) - score(a))[0] || null;
  }
  if (synth) {
    pickVoice();
    synth.onvoiceschanged = pickVoice;
  }
  function clipFor(text, who) {
    const file = AUDIO[`${VOICES[who] || VOICES.main}|${text}`];
    return file ? `audio/${file}` : null;
  }
  function stopSpeaking() {
    if (currentAudio) currentAudio.pause();
    currentAudio = null;
    if (synth) synth.cancel();
  }
  function speakWithBrowser(text) {
    if (!synth) return Promise.resolve();
    return new Promise((resolve) => {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "en-US";
      if (voice) u.voice = voice;
      const tone = Core.toneOf(text); // 대사 감정에 맞춰 빠르기·음높이 조절
      u.rate = state.settings.rate * tone.speed;
      u.pitch = 1 + tone.pitch * 0.08;
      u.onend = u.onerror = resolve;
      synth.speak(u);
    });
  }
  function speak(text, who) {
    stopSpeaking();
    const src = clipFor(text, who);
    if (!src) return speakWithBrowser(text);
    return new Promise((resolve) => {
      const a = new Audio(src);
      currentAudio = a;
      a.playbackRate = state.settings.rate / 0.9; // 기본 속도 0.9 = 녹음 원래 속도
      const fallback = () => {
        if (currentAudio !== a) return resolve();
        currentAudio = null;
        speakWithBrowser(text).then(resolve);
      };
      a.onended = () => resolve();
      a.onpause = () => currentAudio !== a && resolve();
      a.onerror = fallback;
      a.play().catch(fallback);
    });
  }
  function speakBtn(text, who) {
    const btn = h("button", { class: "icon-btn", title: "듣기", "aria-label": "듣기" }, icon("speaker"));
    btn.onclick = async () => {
      btn.classList.add("playing");
      await speak(text, who);
      btn.classList.remove("playing");
    };
    return btn;
  }

  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  // 따라 말하기: 브라우저가 음성 인식을 지원할 때만 표시
  function shadowBtn(target, resultEl) {
    if (!Recognition) return null;
    const btn = h("button", { class: "icon-btn", title: "따라 말하기", "aria-label": "따라 말하기" }, icon("mic"));
    btn.onclick = () => {
      const rec = new Recognition();
      rec.lang = "en-US";
      rec.interimResults = false;
      rec.maxAlternatives = 3;
      btn.classList.add("recording");
      resultEl.textContent = "듣고 있어요… 말해 보세요";
      resultEl.className = "shadow-result";
      rec.onresult = (e) => {
        const alts = Array.from(e.results[0]).map((a) => a.transcript);
        const best = alts.reduce(
          (b, a) => (Core.similarity(target, a) > Core.similarity(target, b) ? a : b),
          alts[0]
        );
        const score = Math.round(Core.similarity(target, best) * 100);
        resultEl.textContent = `"${best}" — ${score}% ${score >= 80 ? "훌륭해요." : score >= 50 ? "좋아요, 한 번 더." : "천천히 다시 해 봐요."}`;
        resultEl.className = "shadow-result " + (score >= 80 ? "good" : score >= 50 ? "ok" : "bad");
      };
      rec.onerror = () => {
        resultEl.textContent = "음성을 인식하지 못했어요. 마이크 권한을 확인해 주세요.";
      };
      rec.onend = () => btn.classList.remove("recording");
      rec.start();
    };
    return btn;
  }

  // ---------- 10분 타이머 (상단 타임코드) ----------
  // 마지막 3분 동안 숫자가 점점 붉어지고, 마지막 1분은 초마다 흔들리고, 마지막 10초는 계속 떨린다.
  const HEAT_FROM = 180;
  const reelEl = document.getElementById("reel");
  let timerId = null;
  let elapsed = 0;
  let overNotified = false;
  function fmt(sec) {
    const a = Math.abs(sec);
    return `${sec < 0 ? "+" : ""}${String(Math.floor(a / 60)).padStart(2, "0")}:${String(a % 60).padStart(2, "0")}`;
  }
  function idleTimer() {
    timerEl.textContent = fmt(SESSION_SECONDS);
    timerEl.className = "timer idle";
    timerEl.style.setProperty("--heat", 0);
    reelEl.parentElement.classList.add("idle");
  }
  function startTimer() {
    stopTimer();
    elapsed = 0;
    overNotified = false;
    reelEl.parentElement.classList.remove("idle");
    tick();
    timerId = setInterval(() => {
      if (document.hidden) return;
      elapsed++;
      tick();
    }, 1000);
  }
  function tick() {
    const left = SESSION_SECONDS - elapsed;
    const heat = left >= HEAT_FROM ? 0 : Math.pow((HEAT_FROM - Math.max(left, 0)) / HEAT_FROM, 0.7);
    timerEl.textContent = fmt(left);
    timerEl.className = "timer";
    timerEl.style.setProperty("--heat", heat.toFixed(3));
    reelEl.style.setProperty("--heat", heat.toFixed(3));
    reelEl.style.setProperty("--left", (Math.max(left, 0) / SESSION_SECONDS).toFixed(4));
    if (left <= 0) timerEl.classList.add("over");
    else if (left <= 10) timerEl.classList.add("critical");
    else if (left <= 60) timerEl.classList.add("warn");
    void timerEl.offsetWidth; // 흔들림 애니메이션을 매 초 다시 시작
    timerEl.classList.add("tick");
    if (left <= 0 && !overNotified) {
      overNotified = true;
      toast("10분이 지났어요. 지금 단계까지만 마무리해요.");
    }
  }
  function stopTimer() {
    if (timerId) clearInterval(timerId);
    timerId = null;
    idleTimer();
    return elapsed;
  }

  // ---------- 탭 ----------
  const tabs = document.querySelectorAll(".tabs button");
  if (!globalThis.FEATURES.tenMinutes) {
    document.querySelectorAll('[data-tab="review"], [data-tab="journal"]').forEach((b) => (b.hidden = true));
    document.querySelector(".clock").hidden = true;
  }
  document.querySelector(".tabs").style.gridTemplateColumns = `repeat(${Array.from(tabs).filter((b) => !b.hidden).length}, 1fr)`;
  function setTab(name) {
    tabs.forEach((b) => b.classList.toggle("active", b.dataset.tab === name));
  }
  tabs.forEach((b) =>
    b.addEventListener("click", async () => {
      if (session && !(await ask("학습을 중단할까요? 진행 중인 내용은 저장되지 않아요.", "중단하기", true))) return;
      endSession();
      route(b.dataset.tab);
    })
  );
  function route(name) {
    setTab(name);
    ({ home: renderHome, review: renderReviewTab, journal: renderJournal, progress: renderProgress })[name]();
  }

  // ---------- 홈 ----------
  function freePromptForToday() {
    const n = Core.daysBetween("2024-01-01", today());
    return FREE_PROMPTS[((n % FREE_PROMPTS.length) + FREE_PROMPTS.length) % FREE_PROMPTS.length];
  }

  // ---------- 문장 카드 (그림 + 영어 + 한국어) ----------
  // 영화 스틸 한 장: 문장 사진이 있으면 사진, 없으면 사진 자리 표시
  function sceneFor(item) {
    const lesson = LESSONS.find((l) => l.id === item.lessonId);
    const photo = SCENES.photos[item.id];
    const no = Number(String(item.id).split("-s")[1]);
    return h(
      "figure",
      { class: "still", role: "img", "aria-label": item.scene || (lesson ? lesson.title : "장면") },
      photo ? h("img", { src: photo.src, alt: "", loading: "lazy", decoding: "async" }) : h("div", { class: "still-empty" }, icon("camera"), h("span", {}, "사진 준비 중")),
      item.native ? h("span", { class: "native-mark" }, "Native · 교과서 밖 표현") : null,
      h(
        "figcaption",
        { class: "slate" },
        h("span", {}, `Sc. ${String(item.lessonId).padStart(2, "0")} · ${item.scene || (lesson ? lesson.title : "")}`),
        h("span", {}, photo && photo.credit ? `Photo · ${photo.credit}` : `Take ${String(no + 1).padStart(2, "0")}`)
      )
    );
  }

  function lessonItems(lesson) {
    return lesson.sentences.map((x, i) => ({ ...x, id: Core.sentenceId(lesson, i), lessonId: lesson.id }));
  }

  function sentenceCard(item, { hideEn = false } = {}) {
    return h(
      "article",
      { class: "sentence" },
      sceneFor(item),
      h(
        "div",
        { class: "subtitle" },
        h("p", { class: "sentence-en", hidden: hideEn }, item.en, speakBtn(item.en)),
        h("div", { class: "hair" }),
        h("p", { class: "sentence-ko" }, item.ko)
      )
    );
  }

  // 레슨을 다 마친 뒤 홈에 띄울 오늘의 복습 문장 10개 (날짜마다 바뀜)
  function reviewSentencesForToday() {
    const pool = LESSONS.filter((l) => state.completed.includes(l.id)).flatMap(lessonItems);
    const start = (Core.daysBetween("2024-01-01", today()) * 10) % pool.length;
    return Array.from({ length: Math.min(10, pool.length) }, (_, k) => pool[(start + k) % pool.length]);
  }

  // 카드 여러 장을 한 장씩 넘겨 보는 뷰어 (스와이프, 점, 화살표)
  function carousel(items, { render, onChange } = {}) {
    let idx = 0;
    const stage = h("div", { class: "stage" });
    const dots = items.map((_, i) => h("button", { class: "tickmark", "aria-label": `${i + 1}번째 문장`, onclick: () => go(i) }));
    const prev = h("button", { class: "nav-btn", "aria-label": "이전 문장", onclick: () => go(idx - 1) }, icon("left"));
    const next = h("button", { class: "nav-btn", "aria-label": "다음 문장", onclick: () => go(idx + 1) }, icon("right"));
    const counter = h("span", { class: "counter" });
    function go(i) {
      idx = Math.max(0, Math.min(items.length - 1, i));
      stage.replaceChildren(render(items[idx], idx));
      dots.forEach((d, k) => d.classList.toggle("on", k === idx));
      counter.textContent = `${String(idx + 1).padStart(2, "0")} / ${String(items.length).padStart(2, "0")}`;
      prev.disabled = idx === 0;
      next.disabled = idx === items.length - 1;
      if (onChange) onChange(idx);
    }
    let x0 = null;
    stage.addEventListener("touchstart", (e) => (x0 = e.touches[0].clientX), { passive: true });
    stage.addEventListener("touchend", (e) => {
      if (x0 == null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) go(idx + (dx < 0 ? 1 : -1));
      x0 = null;
    });
    go(0);
    const pager = items.length > 1 ? h("div", { class: "pager" }, prev, h("div", { class: "ticks" }, dots), next) : null;
    return { stage, pager, counter, go, get index() { return idx; } };
  }

  // ---------- 레벨 ----------
  function applyLevel() {
    const level = LEVELS.find((l) => l.id === state.level) || LEVELS[0];
    document.documentElement.dataset.level = level.id;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = getComputedStyle(document.documentElement).getPropertyValue("--bg").trim() || level.color;
  }
  function setLevel(id) {
    state.level = id;
    save();
    applyLevel();
    levelUI.renderLevelHome();
  }
  // 10분 코스에서 이 계급의 Day 범위 [시작, 끝] 안의 다음 레슨
  const inRange = (l, [a, b]) => l.id >= a && l.id <= b;
  function nextLessonIn(range) {
    return LESSONS.find((l) => inRange(l, range) && !state.completed.includes(l.id)) || null;
  }
  function lessonsDoneIn(range) {
    const all = LESSONS.filter((l) => inRange(l, range));
    return { done: all.filter((l) => state.completed.includes(l.id)).length, total: all.length };
  }

  // 홈: 레벨 선택과 학습 메뉴
  function renderHome() {
    levelUI.renderLevelHome();
  }

  // 10분 코스 홈: 오늘 배울 문장과 번역만 크게
  function renderTenMinutesHome(range) {
    const lesson = nextLessonIn(range);
    const doneToday = state.lastStudy === today();
    const items = lesson ? lessonItems(lesson) : reviewSentencesForToday();
    if (!items.length) {
      mount(h("button", { class: "back", onclick: renderHome }, icon("left"), "홈"), h("section", { class: "card center" }, h("p", {}, "이 레벨의 레슨을 모두 마쳤어요.")));
      return;
    }

    const view_ = carousel(items, { render: (it) => sentenceCard(it) });

    mount(
      h("button", { class: "back", onclick: renderHome }, icon("left"), "홈"),
      h(
        "div",
        { class: "today" },
        h("div", { class: "today-head" }, h("p", { class: "eyebrow" }, lesson ? `Today · Day ${lesson.id}` : "Today · Review"), view_.counter),
        view_.stage,
        view_.pager,
        h(
          "button",
          { class: "btn primary big", onclick: () => startSession(lesson) },
          doneToday ? "한 번 더 연습하기" : "10분 연습 시작",
          icon("arrow")
        )
      )
    );
  }

  // ---------- 학습 세션 ----------
  let session = null;

  function startSession(lesson) {
    const reviews = Core.dueCards(state, LESSONS, today(), REVIEW_LIMIT);
    const steps = [];
    if (reviews.length) steps.push("review");
    if (lesson) steps.push("learn", "dialogue", "drill", "write");
    else steps.push("write");
    session = { lesson, reviews, steps, index: 0, entry: null };
    startTimer();
    renderStep();
  }

  function endSession() {
    if (!session) return;
    session = null;
    stopTimer();
    stopSpeaking();
  }

  function nextStep() {
    session.index++;
    renderStep();
  }

  const STEP_LABEL = { review: "복습", learn: "핵심 표현", dialogue: "대화", drill: "문장 만들기", write: "작문" };

  function stepHeader() {
    const { steps, index } = session;
    return h(
      "div",
      { class: "stepper" },
      steps.map((s, i) => h("div", { class: "step" + (i < index ? " done" : i === index ? " now" : "") }, h("i"), h("span", {}, STEP_LABEL[s])))
    );
  }

  function renderStep() {
    const step = session.steps[session.index];
    if (!step) return finishSession();
    ({ review: stepReview, learn: stepLearn, dialogue: stepDialogue, drill: stepDrill, write: stepWrite })[step]();
  }

  // 1) 복습 카드 (세션 안과 복습 탭에서 공용)
  function reviewDeck(cards, onDone) {
    let i = 0;
    const box = h("div");
    function show() {
      if (i >= cards.length) return onDone();
      const c = cards[i];
      const result = h("p", { class: "shadow-result" });
      const answer = h(
        "div",
        { class: "answer", hidden: true },
        h("p", { class: "en big-en" }, c.en),
        h("div", { class: "today-actions" }, speakBtn(c.en), shadowBtn(c.en, result)),
        result,
        h(
          "div",
          { class: "grade" },
          h("button", { class: "btn again", onclick: () => grade("again") }, "다시", h("small", {}, "내일")),
          h("button", { class: "btn good", onclick: () => grade("good") }, "알았어요", h("small", {}, "조금 뒤")),
          h("button", { class: "btn easy", onclick: () => grade("easy") }, "쉬워요", h("small", {}, "한참 뒤"))
        )
      );
      const reveal = h(
        "button",
        {
          class: "btn primary",
          onclick: () => {
            reveal.remove();
            answer.hidden = false;
            speak(c.en);
          }
        },
        "정답 보기"
      );
      box.replaceChildren(
        h(
          "div",
          { class: "card flash" },
          h("p", { class: "counter" }, `${String(i + 1).padStart(2, "0")} / ${String(cards.length).padStart(2, "0")} · 영어로 말해 보세요`),
          sceneFor(c),
          h("p", { class: "ko big-ko" }, c.ko),
          reveal,
          answer
        )
      );
    }
    function grade(g) {
      state.cards[cards[i].id] = Core.gradeCard(state.cards[cards[i].id], g, today());
      save();
      i++;
      show();
    }
    show();
    return box;
  }

  function stepReview() {
    mount(
      stepHeader(),
      heading("Review", "기억나나요?", "한국어를 보고 소리 내어 영어로 말한 뒤 정답을 확인하세요."),
      reviewDeck(session.reviews, nextStep)
    );
  }

  // 2) 핵심 표현: 한 화면에 한 문장씩
  function stepLearn() {
    const l = session.lesson;
    const items = lessonItems(l);
    const result = h("p", { class: "shadow-result" });
    const tip = h("p", { class: "tip", hidden: true });
    const tipBtn = h("button", { class: "ghost-btn", "aria-expanded": "false" }, icon("note"), "표현 노트");
    tipBtn.onclick = () => {
      tip.hidden = !tip.hidden;
      tipBtn.setAttribute("aria-expanded", String(!tip.hidden));
    };
    const mic = h("span", { class: "mic-slot" });
    const nextLabel = h("span");
    const nextBtn = h("button", { class: "btn primary big", onclick: () => (v.index < items.length - 1 ? v.go(v.index + 1) : nextStep()) }, nextLabel, icon("arrow"));
    const v = carousel(items, {
      render: (it) => sentenceCard(it),
      onChange: (i) => {
        const it = items[i];
        tip.textContent = it.note || it.tip || "";
        tip.hidden = !it.native; // 원어민 표현은 설명을 바로 펼쳐 둔다
        tipBtn.hidden = !tip.textContent;
        tipBtn.setAttribute("aria-expanded", String(!tip.hidden));
        result.textContent = "";
        mic.replaceChildren(...[shadowBtn(items[i].en, result)].filter(Boolean));
        nextLabel.textContent = i < items.length - 1 ? "다음 문장" : "다음: 대화 듣기";
        speak(items[i].en);
      }
    });
    mount(
      stepHeader(),
      h(
        "div",
        { class: "today" },
        h("div", { class: "today-head" }, h("p", { class: "eyebrow" }, `Pattern · ${l.pattern.en}`), v.counter),
        v.stage,
        h("div", { class: "today-actions" }, mic, tipBtn),
        tip,
        result,
        v.pager,
        nextBtn
      )
    );
  }

  // 3) 대화
  function stepDialogue() {
    const l = session.lesson;
    let showKo = false;
    const lines = l.dialogue.map((d) =>
      h(
        "div",
        { class: "line" },
        h("p", { class: "who" }, d.s === "A" ? "A" : "B — YOU"),
        h("p", { class: "en" }, h("span", {}, d.en), speakBtn(d.en, d.s)),
        h("p", { class: "ko", hidden: true }, d.ko)
      )
    );
    const script = h("div", { class: "script" }, lines);
    const toggle = h(
      "button",
      {
        class: "btn",
        onclick: () => {
          showKo = !showKo;
          lines.forEach((el) => (el.querySelector(".ko").hidden = !showKo));
          toggle.textContent = showKo ? "해석 숨기기" : "해석 보기";
        }
      },
      "해석 보기"
    );
    const playAll = h(
      "button",
      {
        class: "btn",
        onclick: async () => {
          script.classList.add("playing");
          for (const [i, d] of l.dialogue.entries()) {
            if (!session) return;
            lines.forEach((el) => el.classList.remove("playing"));
            lines[i].classList.add("playing");
            await speak(d.en, d.s);
          }
          lines.forEach((el) => el.classList.remove("playing"));
          script.classList.remove("playing");
        }
      },
      icon("play"),
      "전체 듣기"
    );
    mount(
      stepHeader(),
      heading("Scene", "상황 속 대화", "먼저 해석 없이 들어 보고, B의 대사를 직접 소리 내어 연기해 보세요."),
      h("div", { class: "row gap" }, playAll, toggle),
      script,
      h("button", { class: "btn primary big", onclick: nextStep }, "다음: 문장 만들기", icon("arrow"))
    );
  }

  // 4) 문장 조립 드릴
  function stepDrill() {
    const drills = Core.drillSentences(session.lesson);
    let i = 0;
    const box = h("div");
    function show() {
      if (i >= drills.length) return nextStep();
      const d = drills[i];
      const tokens = Core.tokenize(d.en);
      const bank = Core.shuffled(tokens.map((_, k) => k)).map((k) => ({ t: tokens[k], k }));
      const picked = [];
      const answerEl = h("div", { class: "answer-line" });
      const bankEl = h("div", { class: "bank" });
      const feedback = h("p", { class: "feedback" });
      const checkBtn = h("button", { class: "btn primary", onclick: check }, "확인");
      let solved = false;

      function draw() {
        answerEl.replaceChildren(
          ...(picked.length ? picked.map((p) => h("button", { class: "chip on", onclick: () => unpick(p) }, p.t)) : [h("span", { class: "placeholder" }, "단어를 순서대로 눌러 보세요")])
        );
        bankEl.replaceChildren(
          ...bank.map((b) => h("button", { class: "chip", disabled: picked.includes(b), onclick: () => pick(b) }, b.t))
        );
      }
      function pick(b) {
        if (solved) return;
        picked.push(b);
        feedback.textContent = "";
        draw();
      }
      function unpick(p) {
        if (solved) return;
        picked.splice(picked.indexOf(p), 1);
        draw();
      }
      function check() {
        if (solved) {
          i++;
          return show();
        }
        const said = picked.map((p) => p.t).join(" ");
        if (Core.sameSentence(said, d.en)) {
          solved = true;
          feedback.className = "feedback good";
          feedback.textContent = "정답! 소리 내어 한 번 읽어 보세요.";
          speak(d.en);
          checkBtn.textContent = i + 1 < drills.length ? "다음 문제" : "다음: 작문";
        } else {
          feedback.className = "feedback bad";
          feedback.replaceChildren("아쉬워요. 다시 해 보세요. ", h("button", { class: "link", onclick: () => { feedback.textContent = `정답: ${d.en}`; } }, "정답 보기"));
        }
      }
      draw();
      box.replaceChildren(
        h(
          "section",
          { class: "card" },
          h("p", { class: "counter" }, `${String(i + 1).padStart(2, "0")} / ${String(drills.length).padStart(2, "0")}`),
          h("p", { class: "ko big-ko" }, d.ko),
          answerEl,
          bankEl,
          feedback,
          h("div", { class: "row gap" }, h("button", { class: "btn", onclick: () => { if (!solved) { picked.length = 0; draw(); } } }, "초기화"), checkBtn)
        )
      );
    }
    mount(stepHeader(), heading("Word Order", "영어 문장 만들기", "한국어 뜻에 맞게 단어를 배열하세요. 영어의 어순이 몸에 붙어요."), box);
    show();
  }

  // 5) 작문
  function writingTask() {
    const l = session.lesson;
    if (l) {
      return {
        level: l.level,
        prompt: l.writing.prompt,
        hints: l.writing.hints,
        samples: l.writing.samples,
        rule: { ...l.writing, minSentences: l.writing.minSentences || MIN_SENTENCES[l.level] }
      };
    }
    const f = freePromptForToday();
    return { level: 4, prompt: f.prompt, hints: f.hints, samples: [], rule: { minWords: 30, minSentences: MIN_SENTENCES[4] } };
  }

  function stepWrite() {
    const task = writingTask();
    const ta = h("textarea", { rows: task.level >= 3 ? 8 : 4, placeholder: "영어로 써 보세요…", autocapitalize: "sentences", spellcheck: "true" });
    const checklist = h("ul", { class: "checklist" });
    const after = h("div");
    const draft = `draft-${today()}-${session.lesson ? session.lesson.id : "free"}`;
    try {
      ta.value = sessionStorage.getItem(draft) || "";
    } catch (e) {
      /* 무시 */
    }
    ta.addEventListener("input", () => {
      try {
        sessionStorage.setItem(draft, ta.value);
      } catch (e) {
        /* 무시 */
      }
      renderChecks();
    });

    function renderChecks() {
      const r = Core.checkWriting(ta.value, task.rule);
      checklist.replaceChildren(...r.checks.map((c) => h("li", { class: c.ok ? "ok" : "" }, c.label)));
      return r;
    }

    const submit = h(
      "button",
      {
        class: "btn primary big",
        onclick: async () => {
          const r = renderChecks();
          if (!r.passed && !(await ask("아직 체크리스트를 모두 채우지 못했어요. 그래도 제출할까요?", "제출하기"))) return;
          submit.hidden = true;
          ta.readOnly = true;
          showFeedback(task, ta.value, after);
        }
      },
      "제출하고 예시 보기"
    );

    mount(
      stepHeader(),
      heading("Composition", "직접 써 보기"),
      h("p", { class: "badge" }, `Lv.${task.level} · ${LEVEL_NAMES[task.level]}`),
      h("section", { class: "card" }, h("p", { class: "prompt" }, task.prompt), h("div", { class: "hints" }, h("span", { class: "muted small" }, "힌트 "), task.hints.map((x) => h("button", { class: "chip hint", onclick: () => insertAtCursor(ta, x) }, x)))),
      ta,
      checklist,
      submit,
      after
    );
    renderChecks();
    ta.focus();
  }

  function insertAtCursor(ta, text) {
    if (ta.readOnly) return;
    const clean = text.replace(/~/g, "").replace(/\s+/g, " ").trim();
    const s = ta.selectionStart ?? ta.value.length;
    const before = ta.value.slice(0, s);
    const pad = before && !/\s$/.test(before) ? " " : "";
    ta.value = before + pad + clean + " " + ta.value.slice(ta.selectionEnd ?? s);
    ta.focus();
    ta.dispatchEvent(new Event("input"));
  }

  function showFeedback(task, text, container) {
    const revise = h("textarea", { rows: task.level >= 3 ? 8 : 4 });
    revise.value = text;
    container.replaceChildren(
      ...[
      task.samples.length
        ? h("section", { class: "card sample" }, h("p", { class: "eyebrow" }, "예시 답안"), task.samples.map((s) => h("p", { class: "en" }, h("span", {}, s), speakBtn(s))))
        : null,
      h(
        "section",
        { class: "card" },
        h("p", { class: "eyebrow" }, "스스로 고쳐 쓰기"),
        h("p", { class: "muted small" }, "예시와 비교해서 더 자연스럽게 바꾸고 싶은 부분을 고쳐 보세요. 좋은 표현은 훔쳐 와도 돼요!"),
        h("ul", { class: "checklist plain" }, [
          "주어와 동사가 모두 있나요?",
          "시제(현재/과거/미래)가 맞나요?",
          "a / the / 복수형(-s)을 빠뜨리지 않았나요?",
          "문장과 문장 사이를 and, but, because, so 등으로 이어 봤나요?"
        ].map((q) => h("li", {}, q))),
        revise
      ),
      h("button", { class: "btn primary big", onclick: () => saveWriting(task, text, revise.value) }, "작문노트에 저장하고 마치기")
      ].filter(Boolean)
    );
    container.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function saveWriting(task, first, final) {
    if (!final.trim()) return toast("내용을 입력해 주세요.");
    state.journal.unshift({
      date: today(),
      lessonId: session.lesson ? session.lesson.id : null,
      level: task.level,
      prompt: task.prompt,
      first: first.trim(),
      text: final.trim()
    });
    try {
      sessionStorage.removeItem(`draft-${today()}-${session.lesson ? session.lesson.id : "free"}`);
    } catch (e) {
      /* 무시 */
    }
    nextStep();
  }

  function finishSession() {
    const l = session.lesson;
    const seconds = stopTimer();
    if (l && !state.completed.includes(l.id)) {
      state.completed.push(l.id);
      Core.addCards(state, l, today());
    }
    state.history[today()] = (state.history[today()] || 0) + seconds;
    Core.markStudied(state, today());
    save();
    session = null;
    levelUI.checkPromotion();

    const mins = Math.max(1, Math.round(seconds / 60));
    const next = Core.nextLesson(state, LESSONS);
    mount(
      h(
        "section",
        { class: "fin" },
        h("p", { class: "fin-word" }, "Fin."),
        h("h1", {}, "오늘의 10분 완료"),
        h("p", {}, `${mins}분 동안 집중했어요. 연속 ${Core.currentStreak(state, today())}일째!`),
        l ? h("p", { class: "muted" }, `오늘 배운 문장 ${l.sentences.length}개는 내일부터 복습 카드로 다시 나와요.`) : null,
        next && l && next.level > l.level ? h("p", { class: "badge" }, `다음 레슨부터 작문 Lv.${next.level} · ${LEVEL_NAMES[next.level]}`) : null,
        h("div", { class: "row gap center" }, h("button", { class: "btn", onclick: () => route("journal") }, "작문노트 보기"), h("button", { class: "btn primary", onclick: () => route("home") }, "홈으로"))
      )
    );
  }

  // ---------- 복습 탭 ----------
  function renderReviewTab() {
    const due = Core.dueCards(state, LESSONS, today());
    const total = Object.keys(state.cards).length;
    if (!due.length) {
      mount(
        heading("Review", "복습"),
        h("section", { class: "card center" }, h("p", {}, total ? "오늘 복습할 카드를 모두 끝냈어요." : "레슨을 마치면 배운 표현이 복습 카드로 쌓여요."), h("p", { class: "muted small" }, `전체 카드 ${total}개`)),
        practiceAll()
      );
      return;
    }
    mount(
      heading("Review", `복습 ${due.length}개`, "잊어버릴 때쯤 다시 보여 주는 간격 반복 방식이에요."),
      reviewDeck(due, renderReviewTab)
    );
  }

  // 배운 표현 전체를 소리 내어 훑어보는 목록
  function practiceAll() {
    const learned = LESSONS.filter((l) => state.completed.includes(l.id));
    if (!learned.length) return null;
    return h(
      "section",
      { class: "card" },
      h("h3", {}, "배운 표현 모아 보기"),
      learned.map((l) =>
        h("details", {}, h("summary", {}, `Day ${l.id}. ${l.title}`), l.sentences.map((e) => h("div", { class: "mini" }, h("p", { class: "en" }, h("span", {}, e.en), speakBtn(e.en)), h("p", { class: "ko" }, e.ko))))
      )
    );
  }

  // ---------- 작문노트 ----------
  function renderJournal() {
    if (!state.journal.length) {
      mount(heading("Journal", "작문노트"), h("section", { class: "card center" }, h("p", {}, "아직 작문이 없어요."), h("p", { class: "muted small" }, "매일 쓴 영작이 여기에 쌓여요. 한 달 뒤 첫 글과 비교해 보세요.")));
      return;
    }
    const totalWords = state.journal.reduce((n, j) => n + Core.words(j.text).length, 0);
    mount(
      heading("Journal", "작문노트", `${state.journal.length}편 · 총 ${totalWords}단어를 영어로 썼어요.`),
      h("div", { class: "row gap" }, h("button", { class: "btn", onclick: exportJournal }, icon("copy"), "전체 복사")),
      state.journal.map((j, idx) =>
        h(
          "article",
          { class: "card entry" },
          h("div", { class: "row between" }, h("span", { class: "muted small" }, `${j.date} · Lv.${j.level}`), h("button", { class: "link danger", onclick: async () => { if (await ask("이 글을 삭제할까요?", "삭제", true)) { state.journal.splice(idx, 1); save(); renderJournal(); } } }, "삭제")),
          h("p", { class: "muted small" }, j.prompt),
          h("p", { class: "en entry-text" }, h("span", {}, j.text), speakBtn(j.text)),
          j.first && j.first !== j.text ? h("details", {}, h("summary", { class: "small" }, "고치기 전 글 보기"), h("p", { class: "muted" }, j.first)) : null
        )
      )
    );
  }

  function exportJournal() {
    const text = state.journal.map((j) => `[${j.date}] ${j.prompt}\n${j.text}`).join("\n\n");
    const fallback = () => {
      const ta = h("textarea", { rows: 8, readonly: true });
      ta.value = text;
      view.prepend(h("section", { class: "card" }, h("p", { class: "muted small" }, "자동 복사가 막혀 있어요. 아래 글을 길게 눌러 복사하세요."), ta));
      ta.focus();
      ta.select();
    };
    try {
      navigator.clipboard.writeText(text).then(() => toast("작문노트를 복사했어요."), fallback);
    } catch (e) {
      fallback();
    }
  }

  // ---------- 진도 ----------
  function renderProgress() {
    const days = Object.keys(state.history).length;
    const totalMin = Math.round(Object.values(state.history).reduce((a, b) => a + b, 0) / 60);
    const last28 = Array.from({ length: 28 }, (_, i) => Core.addDays(today(), i - 27));
    const rate = h("input", { type: "range", min: "0.6", max: "1.2", step: "0.1", value: String(state.settings.rate) });
    const rateLabel = h("span", {}, `${state.settings.rate}x`);
    rate.addEventListener("input", () => {
      state.settings.rate = Number(rate.value);
      rateLabel.textContent = `${state.settings.rate}x`;
      save();
    });

    mount(
      heading("Record", "나의 기록"),
      h(
        "div",
        { class: "stats" },
        [
          [Core.currentStreak(state, today()), "연속 학습일"],
          [days, "학습한 날"],
          [totalMin, "총 학습(분)"],
          [state.journal.length, "작문"]
        ].map(([n, label]) => h("div", { class: "stat" }, h("b", {}, n), h("small", {}, label)))
      ),
      h(
        "section",
        { class: "card" },
        h("h3", {}, "최근 4주"),
        h("div", { class: "calendar" }, last28.map((d) => h("i", { class: state.history[d] ? "on" : "", title: d })))
      ),
      h("section", { class: "card" }, h("h3", {}, "복무 기록"), levelUI.progressSummary()),
      globalThis.FEATURES.tenMinutes ? h(
        "section",
        { class: "card" },
        h("h3", {}, "10분 코스"),
        [1, 2, 3].map((lv) =>
          h(
            "div",
            {},
            h("p", { class: "eyebrow" }, `Lv.${lv} ${LEVEL_NAMES[lv]}`),
            h("ul", { class: "lessons" }, LESSONS.filter((l) => l.level === lv).map((l) => h("li", { class: state.completed.includes(l.id) ? "done" : "" }, h("span", { class: "no" }, String(l.id).padStart(2, "0")), h("span", {}, l.title), h("small", {}, l.pattern.en))))
          )
        )
      ) : null,
      h(
        "section",
        { class: "card" },
        h("h3", {}, "설정"),
        h("label", { class: "row gap" }, "읽기 속도", rate, rateLabel, speakBtn("This is how fast I will speak.")),
        h(
          "button",
          {
            class: "link danger",
            onclick: async () => {
              if (await ask("모든 학습 기록을 지울까요? 되돌릴 수 없어요.", "모두 지우기", true)) {
                state = Core.defaultState();
                save();
                route("home");
              }
            }
          },
          "학습 기록 초기화"
        )
      )
    );
  }

  // ---------- 시작 ----------
  const levelUI = globalThis.LevelUI({
    h, icon, mount, heading, speak, speakBtn, shadowBtn, toast,
    state: () => state,
    save,
    setLevel,
    studied: (seconds) => {
      state.history[today()] = (state.history[today()] || 0) + seconds;
      Core.markStudied(state, today());
    },
    nextLessonIn,
    lessonsDoneIn,
    renderTenMinutesHome,
    applyLevel
  });
  applyLevel();
  tabs.forEach((b) => b.prepend(icon(b.dataset.icon)));
  idleTimer();
  renderStreak();
  route("home");
  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
})();
