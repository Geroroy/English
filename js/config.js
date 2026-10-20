// 앱 전체 설정: 기능 켜기/끄기와 계급(레벨) 정의
// FEATURES.tenMinutes 를 false 로 바꾸면 "10분 코스"(상단 타이머, 복습 탭, 작문노트 탭, 10분 코스 카드)가
// 화면에서 모두 사라집니다. 완전히 지우고 싶다면 README의 "10분 코스 제거" 항목을 보세요.
globalThis.FEATURES = {
  tenMinutes: true
};

// 계급 = 레벨. CEFR 6단계를 4계급으로 나눈 기준:
//   CEFR 공식 묶음은 기초(A1·A2) / 독립(B1·B2) / 능숙(C1·C2) 셋인데, 한국 학습자가 가장 많이 멈추는
//   A1→A2 구간(소리에서 문장으로)을 둘로 나누고 나머지는 공식 묶음을 그대로 따릅니다.
//   누적 학습 시간(케임브리지 기준 대략): A1 100h · A2 200h · B2 600h · C2 1,200h
// 순서가 곧 진급 순서입니다. 한 계급의 메뉴를 모두 마치면 다음 계급으로 진급하고, 병장을 마치면 전역합니다.
// theme 값은 <html data-level="..."> 로 들어가 styles.css 의 테마를 고릅니다.
// modules: 홈 화면의 학습 메뉴. key 는 js/content/<id>.js 의 CONTENT[id][key] 와 짝을 이룹니다.
// lessonRange: 10분 코스에서 이 계급이 맡는 Day 범위 [시작, 끝]
globalThis.LEVELS = [
  {
    id: "private",
    name: "이등병",
    en: "Private",
    cefr: "A1",
    tagline: "소리부터 문장까지, 신병 훈련",
    color: "#2f6fed",
    modules: [
      { key: "phonics", name: "읽는 법", en: "Reading Rules", desc: "알파벳 소리와 파닉스 규칙으로 처음 보는 단어도 읽기", icon: "abc", type: "lesson" },
      { key: "pronunciation", name: "발음", en: "Pronunciation", desc: "한국인이 가장 많이 틀리는 소리를 짝으로 비교해 연습", icon: "mic", type: "lesson" },
      { key: "grammar", name: "기초 문법 I", en: "Basic Grammar I", desc: "be동사, 일반동사, 관사, 복수형", icon: "grid", type: "lesson" },
      { key: "reading", name: "리딩 A1", en: "Reading A1", desc: "아주 짧고 쉬운 글 읽기", icon: "book", type: "reading" },
      { key: "tenMinutes", name: "10분 코스", en: "Ten Minutes", desc: "하루 10문장, 한 문장 작문 (Day 1–4)", icon: "clock", type: "tenMinutes", lessonRange: [1, 4] }
    ]
  },
  {
    id: "pfc",
    name: "일병",
    en: "Private First Class",
    cefr: "A2",
    tagline: "문장을 만들고 생활 단어를 쌓는 단계",
    color: "#1f8a70",
    modules: [
      { key: "grammar", name: "기초 문법 II", en: "Basic Grammar II", desc: "현재진행, 과거형, can/will, 의문사", icon: "grid", type: "lesson" },
      { key: "rush", name: "생활 단어 러쉬", en: "Word Rush A2", desc: "60초 안에 생활 단어 뜻 맞히기", icon: "bolt", type: "rush" },
      { key: "reading", name: "리딩 A2", en: "Reading A2", desc: "메시지, 짧은 이야기 읽기", icon: "book", type: "reading" },
      { key: "tenMinutes", name: "10분 코스", en: "Ten Minutes", desc: "하루 10문장, 한 문장 작문 (Day 5–7)", icon: "clock", type: "tenMinutes", lessonRange: [5, 7] }
    ]
  },
  {
    id: "corporal",
    name: "상병",
    en: "Corporal",
    cefr: "B1–B2",
    tagline: "어휘를 늘리고 문장을 길게 잇는 단계",
    color: "#2e6b4a",
    modules: [
      { key: "rush", name: "단어 러쉬", en: "Word Rush", desc: "60초 안에 최대한 많은 단어 뜻 맞히기", icon: "bolt", type: "rush" },
      { key: "grammar", name: "중급 문법", en: "Intermediate Grammar", desc: "현재완료, 관계사, 가정법, 수동태를 실제 문장으로", icon: "grid", type: "lesson" },
      { key: "reading", name: "리딩", en: "Reading B1–B2", desc: "실생활 글과 짧은 기사 읽기", icon: "book", type: "reading" },
      { key: "tenMinutes", name: "10분 코스", en: "Ten Minutes", desc: "하루 10문장, 2~3문장 연결 작문 (Day 8–14)", icon: "clock", type: "tenMinutes", lessonRange: [8, 14] }
    ]
  },
  {
    id: "sergeant",
    name: "병장",
    en: "Sergeant",
    cefr: "C1–C2",
    tagline: "원어민이 실제로 쓰는 패턴과 표현",
    color: "#c2a26b",
    modules: [
      { key: "patterns", name: "원어민 패턴", en: "Native Patterns", desc: "교과서에 없는, 원어민 대화의 뼈대가 되는 말투", icon: "chat", type: "lesson" },
      { key: "expressions", name: "원어민 표현", en: "Native Expressions", desc: "관용구와 연어(collocation), 뉘앙스까지", icon: "spark", type: "lesson" },
      { key: "reading", name: "리딩", en: "Reading C1–C2", desc: "칼럼과 에세이 수준의 글 읽기", icon: "book", type: "reading" },
      { key: "tenMinutes", name: "10분 코스", en: "Ten Minutes", desc: "하루 10문장, 짧은 단락 작문 (Day 15–20)", icon: "clock", type: "tenMinutes", lessonRange: [15, 20] }
    ]
  }
];

// 전역: 마지막 계급(병장)의 메뉴를 모두 마치면
globalThis.DISCHARGE = { name: "전역", en: "Discharged", tagline: "모든 훈련 완료. 이제 예비군으로 자유롭게 복습하세요." };
