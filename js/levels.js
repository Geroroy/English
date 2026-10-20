// 레벨 홈과 학습 모듈 화면 (읽는 법·발음·문법·원어민 패턴 = lesson, 리딩 = reading, 단어 러쉬 = rush)
// app.js 가 화면 도구(ui)를 넘겨 주면 렌더 함수들을 돌려 줍니다.
globalThis.LevelUI = function (ui) {
  const { h, icon, mount, heading, speakBtn, shadowBtn, toast } = ui;
  const { LEVELS, FEATURES, CONTENT } = globalThis;

  const levelById = (id) => LEVELS.find((l) => l.id === id) || LEVELS[0];
  const progressKey = (level, mod) => `${level.id}.${mod.key}`;
  function progressOf(level, mod) {
    const s = ui.state();
    s.modules = s.modules || {};
    return (s.modules[progressKey(level, mod)] = s.modules[progressKey(level, mod)] || { done: [], best: 0 });
  }
  function unitsOf(level, mod) {
    const c = CONTENT[level.id] || {};
    return Array.isArray(c[mod.key]) ? c[mod.key] : [];
  }
  function markDone(level, mod, unitId) {
    const p = progressOf(level, mod);
    if (!p.done.includes(unitId)) p.done.push(unitId);
    ui.studied(180); // 단원 하나 = 3분으로 기록
    ui.save();
  }

  // ---------- 레벨 홈 ----------
  // 레벨 선택: 작은 알약 버튼 하나. 누르면 세 레벨이 아래로 펼쳐진다.
  function levelSwitch(current) {
    const menu = h(
      "div",
      { class: "level-menu", role: "listbox", hidden: true },
      LEVELS.map((l) =>
        h(
          "button",
          { role: "option", "aria-selected": String(l.id === current.id), class: l.id === current.id ? "on" : "", onclick: () => ui.setLevel(l.id) },
          h("span", { class: "dot", style: `--c:${l.color}` }),
          h("span", { class: "level-name" }, h("b", {}, l.name), h("small", {}, l.cefr)),
          h("span", { class: "muted small level-tag" }, l.tagline),
          l.id === current.id ? icon("check") : null
        )
      )
    );
    const btn = h(
      "button",
      { class: "level-pill", "aria-haspopup": "listbox", "aria-expanded": "false" },
      h("span", { class: "dot", style: `--c:${current.color}` }),
      h("b", {}, current.name),
      h("small", {}, current.cefr),
      icon("down")
    );
    const close = () => {
      menu.hidden = true;
      btn.setAttribute("aria-expanded", "false");
      document.removeEventListener("click", onDoc);
      document.removeEventListener("keydown", onKey);
    };
    const onDoc = (e) => !wrap.contains(e.target) && close();
    const onKey = (e) => e.key === "Escape" && close();
    btn.onclick = () => {
      if (!menu.hidden) return close();
      menu.hidden = false;
      btn.setAttribute("aria-expanded", "true");
      setTimeout(() => {
        document.addEventListener("click", onDoc);
        document.addEventListener("keydown", onKey);
      });
    };
    const wrap = h("div", { class: "level-select" }, btn, menu);
    return wrap;
  }

  function renderLevelHome() {
    const level = levelById(ui.state().level);
    const cards = level.modules
      .filter((m) => m.type !== "tenMinutes" || FEATURES.tenMinutes)
      .map((m) => {
        let meta;
        if (m.type === "tenMinutes") {
          const next = ui.nextLessonIn(m.lessonLevel);
          meta = next ? `다음 · Day ${next.id} ${next.title}` : "이 레벨의 레슨을 모두 마쳤어요 · 복습";
        } else if (m.type === "rush") {
          meta = `최고 기록 ${progressOf(level, m).best}점`;
        } else {
          const units = unitsOf(level, m);
          meta = `${progressOf(level, m).done.length} / ${units.length} 완료`;
        }
        return h(
          "button",
          { class: "module", onclick: () => openModule(level, m) },
          h("span", { class: "module-icon" }, icon(m.icon)),
          h("span", { class: "module-body" }, h("b", {}, m.name), h("span", { class: "module-en" }, m.en), h("span", { class: "muted small" }, m.desc), h("span", { class: "module-meta" }, meta)),
          icon("right")
        );
      });
    mount(
      h("section", { class: "hero" }, h("div", { class: "hero-head" }, h("p", { class: "eyebrow" }, "Level"), levelSwitch(level)), h("h1", {}, level.tagline)),
      h("div", { class: "modules" }, cards)
    );
  }

  function openModule(level, mod) {
    if (mod.type === "tenMinutes") return ui.renderTenMinutesHome(mod.lessonLevel);
    if (mod.type === "rush") return renderRush(level, mod);
    renderUnitList(level, mod);
  }

  function backBar(label, onclick) {
    return h("button", { class: "back", onclick }, icon("left"), label);
  }

  // ---------- 단원 목록 (lesson, reading 공용) ----------
  function renderUnitList(level, mod) {
    const units = unitsOf(level, mod);
    const p = progressOf(level, mod);
    mount(
      backBar(`${level.name} 홈`, renderLevelHome),
      heading(mod.en, mod.name, mod.desc),
      units.length
        ? h(
            "ol",
            { class: "units" },
            units.map((u, i) =>
              h(
                "li",
                { class: p.done.includes(u.id) ? "done" : "" },
                h("button", { onclick: () => (mod.type === "reading" ? renderReading(level, mod, u) : renderUnit(level, mod, u)) }, h("span", { class: "no" }, String(i + 1).padStart(2, "0")), h("span", { class: "unit-title" }, h("b", {}, u.title), h("small", {}, u.ko || `${u.cefr} · ${u.topic}`)), icon(p.done.includes(u.id) ? "check" : "right"))
              )
            )
          )
        : h("section", { class: "card center" }, h("p", {}, "아직 단원이 없어요."), h("p", { class: "muted small" }, `js/content/${level.id}.js 의 ${mod.key} 에 추가하세요.`))
    );
  }

  // ---------- 단원 (설명 · 예문 · 짝 비교 · 표 · 퀴즈) ----------
  function section(sec) {
    if (sec.type === "text") return h("p", { class: "body" }, sec.body);
    if (sec.type === "examples")
      return h(
        "div",
        { class: "examples" },
        sec.title ? h("p", { class: "eyebrow" }, sec.title) : null,
        sec.items.map((x) => {
          const result = h("p", { class: "shadow-result" });
          return h("div", { class: "mini" }, h("p", { class: "en" }, h("span", {}, x.en), h("span", { class: "row gap" }, speakBtn(x.en), shadowBtn(x.en, result))), h("p", { class: "ko" }, x.ko), x.note ? h("p", { class: "tip" }, x.note) : null, result);
        })
      );
    if (sec.type === "pairs")
      return h(
        "div",
        { class: "pairs" },
        sec.title ? h("p", { class: "eyebrow" }, sec.title) : null,
        sec.items.map((x) => h("div", { class: "pair" }, h("span", { class: "en" }, x.a, speakBtn(x.a)), h("span", { class: "vs" }, "vs"), h("span", { class: "en" }, x.b, speakBtn(x.b)), h("small", { class: "muted" }, x.ko)))
      );
    if (sec.type === "table")
      return h("table", { class: "rules" }, h("thead", {}, h("tr", {}, sec.head.map((c) => h("th", {}, c)))), h("tbody", {}, sec.rows.map((r) => h("tr", {}, r.map((c) => h("td", {}, c))))));
    if (sec.type === "quiz") return quiz(sec.items);
    return null;
  }

  function quiz(items) {
    let correct = 0;
    const score = h("p", { class: "quiz-score muted small" });
    const list = items.map((q, i) => {
      const explain = h("p", { class: "tip", hidden: true }, q.explain || "");
      const choices = q.choices.map((c, k) =>
        h(
          "button",
          {
            class: "choice",
            onclick: () => {
              if (box.dataset.answered) return;
              box.dataset.answered = "1";
              const ok = k === q.answer;
              choices[k].classList.add(ok ? "ok" : "bad");
              choices[q.answer].classList.add("ok");
              choices.forEach((b) => (b.disabled = true));
              if (ok) correct++;
              explain.hidden = !q.explain;
              const answered = list.filter((b) => b.dataset.answered).length;
              score.textContent = `${answered} / ${items.length} 풀이 · ${correct}개 정답`;
            }
          },
          c
        )
      );
      const box = h("div", { class: "quiz-item" }, h("p", { class: "q" }, `${i + 1}. ${q.q}`), h("div", { class: "choices" }, choices), explain);
      return box;
    });
    return h("div", { class: "quiz" }, h("p", { class: "eyebrow" }, "Quiz"), list, score);
  }

  function renderUnit(level, mod, unit) {
    const done = progressOf(level, mod).done.includes(unit.id);
    mount(
      backBar(mod.name, () => renderUnitList(level, mod)),
      heading(mod.en, unit.title, unit.ko),
      unit.intro ? h("p", { class: "intro" }, unit.intro) : null,
      (unit.sections || []).map((s) => h("section", { class: "unit-section" }, section(s))),
      h(
        "button",
        {
          class: "btn primary big",
          onclick: () => {
            markDone(level, mod, unit.id);
            toast(done ? "다시 복습했어요." : "단원 완료!");
            renderUnitList(level, mod);
          }
        },
        done ? "다시 완료 표시" : "이 단원 완료",
        icon("check")
      )
    );
  }

  // ---------- 리딩 ----------
  function renderReading(level, mod, r) {
    const done = progressOf(level, mod).done.includes(r.id);
    mount(
      backBar(mod.name, () => renderUnitList(level, mod)),
      heading(`${r.cefr} · ${r.topic}`, r.title),
      h("article", { class: "passage" }, r.paragraphs.map((p) => h("p", { class: "para" }, h("span", {}, p), speakBtn(p)))),
      r.glossary && r.glossary.length ? h("details", { class: "glossary" }, h("summary", {}, `단어 ${r.glossary.length}개`), h("dl", {}, r.glossary.map((g) => [h("dt", {}, g.w, speakBtn(g.w)), h("dd", {}, g.ko)]))) : null,
      r.questions && r.questions.length ? h("section", { class: "unit-section" }, quiz(r.questions)) : null,
      h(
        "button",
        {
          class: "btn primary big",
          onclick: () => {
            markDone(level, mod, r.id);
            toast(done ? "다시 읽었어요." : "읽기 완료!");
            renderUnitList(level, mod);
          }
        },
        done ? "다시 완료 표시" : "다 읽었어요",
        icon("check")
      )
    );
  }

  // ---------- 단어 러쉬 ----------
  function renderRush(level, mod) {
    const data = (CONTENT[level.id] || {})[mod.key] || { seconds: 60, words: [] };
    const p = progressOf(level, mod);
    const enough = data.words.length >= 4;
    mount(
      backBar(`${level.name} 홈`, renderLevelHome),
      heading(mod.en, mod.name, mod.desc),
      h(
        "section",
        { class: "card center rush-start" },
        h("p", { class: "fin-word" }, String(p.best)),
        h("p", { class: "muted" }, `최고 기록 · 단어 ${data.words.length}개 · ${data.seconds}초`),
        enough ? h("button", { class: "btn primary big", onclick: () => playRush(level, mod, data) }, "시작", icon("bolt")) : h("p", { class: "muted small" }, `단어가 4개 이상 있어야 해요. js/content/${level.id}.js 의 rush.words 에 추가하세요.`)
      )
    );
  }

  function playRush(level, mod, data) {
    const words = data.words.slice().sort(() => Math.random() - 0.5);
    let i = 0;
    let score = 0;
    let streak = 0;
    let left = data.seconds;
    const wrong = [];
    const timeEl = h("span", { class: "rush-time" }, `${left}`);
    const scoreEl = h("span", { class: "rush-score" }, "0");
    const stage = h("div", { class: "rush-stage" });
    const timer = setInterval(() => {
      left--;
      timeEl.textContent = `${left}`;
      if (left <= 10) timeEl.classList.add("hot");
      if (left <= 0) finish();
    }, 1000);
    function next() {
      const w = words[i % words.length];
      i++;
      const others = data.words.filter((x) => x.ko !== w.ko).sort(() => Math.random() - 0.5).slice(0, 3);
      const choices = [w, ...others].sort(() => Math.random() - 0.5);
      stage.replaceChildren(
        h("p", { class: "rush-word" }, w.en),
        h(
          "div",
          { class: "choices" },
          choices.map((c) =>
            h(
              "button",
              {
                class: "choice",
                onclick: () => {
                  if (c === w) {
                    streak++;
                    score += 1 + Math.floor(streak / 5); // 5연속마다 보너스
                  } else {
                    streak = 0;
                    wrong.push(w);
                  }
                  scoreEl.textContent = String(score);
                  next();
                }
              },
              c.ko
            )
          )
        )
      );
    }
    function finish() {
      clearInterval(timer);
      const p = progressOf(level, mod);
      const record = score > p.best;
      if (record) p.best = score;
      ui.studied(data.seconds);
      ui.save();
      mount(
        h(
          "section",
          { class: "fin" },
          h("p", { class: "fin-word" }, String(score)),
          h("h1", {}, record ? "새 기록!" : "끝"),
          h("p", { class: "muted" }, `최고 기록 ${p.best}점`),
          wrong.length ? h("div", { class: "card left" }, h("p", { class: "eyebrow" }, "틀린 단어"), wrong.map((w) => h("div", { class: "mini" }, h("p", { class: "en" }, h("span", {}, w.en), speakBtn(w.en)), h("p", { class: "ko" }, w.ko)))) : null,
          h("div", { class: "row gap center" }, h("button", { class: "btn", onclick: renderLevelHome }, "홈으로"), h("button", { class: "btn primary", onclick: () => playRush(level, mod, data) }, "한 번 더"))
        )
      );
    }
    mount(backBar("그만두기", () => { clearInterval(timer); renderRush(level, mod); }), h("div", { class: "rush-head" }, h("span", { class: "eyebrow" }, "Word Rush"), timeEl, scoreEl), stage);
    next();
  }

  // 기록 탭에 쓸 레벨별 진도 요약
  function progressSummary() {
    return LEVELS.map((level) =>
      h(
        "div",
        {},
        h("p", { class: "eyebrow" }, `${level.cefr} · ${level.name}`),
        h(
          "ul",
          { class: "lessons" },
          level.modules
            .filter((m) => m.type !== "tenMinutes" || FEATURES.tenMinutes)
            .map((m) => {
              const p = progressOf(level, m);
              const text = m.type === "rush" ? `최고 ${p.best}점` : m.type === "tenMinutes" ? `${ui.lessonsDoneIn(m.lessonLevel)} 레슨 완료` : `${p.done.length} / ${unitsOf(level, m).length}`;
              return h("li", {}, h("span", { class: "no" }, icon(m.icon)), h("span", {}, m.name), h("small", {}, text));
            })
        )
      )
    );
  }

  return { renderLevelHome, progressSummary };
};
