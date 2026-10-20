// 앱 전체 설정: 기능 켜기/끄기와 레벨 정의
// FEATURES.tenMinutes 를 false 로 바꾸면 "10분 코스"(상단 타이머, 복습 탭, 작문노트 탭, 10분 코스 카드)가
// 화면에서 모두 사라집니다. 완전히 지우고 싶다면 README의 "10분 코스 제거" 항목을 보세요.
globalThis.FEATURES = {
  tenMinutes: true
};

// 세 레벨. CEFR 기준: 초보 A1–A2, 중급 B1–B2, 고급 C1–C2
// theme 값은 <html data-level="..."> 로 들어가 styles.css 의 테마를 고릅니다.
// modules: 홈 화면에 보이는 학습 메뉴. key 는 js/content/*.js 의 CONTENT[level][key] 와 짝을 이룹니다.
globalThis.LEVELS = [
  {
    id: "beginner",
    name: "초보",
    cefr: "A1–A2",
    tagline: "소리부터 문장까지, 영어의 첫걸음",
    color: "#2f6fed",
    modules: [
      { key: "phonics", name: "읽는 법", en: "Reading Rules", desc: "알파벳 소리와 파닉스 규칙으로 처음 보는 단어도 읽기", icon: "abc", type: "lesson" },
      { key: "pronunciation", name: "발음", en: "Pronunciation", desc: "한국인이 가장 많이 틀리는 소리를 짝으로 비교해 연습", icon: "mic", type: "lesson" },
      { key: "grammar", name: "기초 문법", en: "Basic Grammar", desc: "be동사부터 과거형까지, 문장을 만드는 뼈대", icon: "grid", type: "lesson" },
      { key: "reading", name: "기초 리딩", en: "Reading A1–A2", desc: "짧고 쉬운 글을 읽고 질문에 답하기", icon: "book", type: "reading" },
      { key: "tenMinutes", name: "10분 코스", en: "Ten Minutes", desc: "하루 10문장, 회화에서 한 문장 작문까지 (Day 1–7)", icon: "clock", type: "tenMinutes", lessonLevel: 1 }
    ]
  },
  {
    id: "intermediate",
    name: "중급",
    cefr: "B1–B2",
    tagline: "어휘를 늘리고 문장을 길게 잇는 단계",
    color: "#2e6b4a",
    modules: [
      { key: "rush", name: "단어 러쉬", en: "Word Rush", desc: "60초 안에 최대한 많은 단어 뜻 맞히기", icon: "bolt", type: "rush" },
      { key: "grammar", name: "중급 문법", en: "Intermediate Grammar", desc: "현재완료, 관계사, 가정법, 수동태를 실제 문장으로", icon: "grid", type: "lesson" },
      { key: "reading", name: "리딩", en: "Reading B1–B2", desc: "실생활 글과 짧은 기사 읽기", icon: "book", type: "reading" },
      { key: "tenMinutes", name: "10분 코스", en: "Ten Minutes", desc: "하루 10문장, 2~3문장 연결 작문 (Day 8–14)", icon: "clock", type: "tenMinutes", lessonLevel: 2 }
    ]
  },
  {
    id: "advanced",
    name: "고급",
    cefr: "C1–C2",
    tagline: "원어민이 실제로 쓰는 패턴과 표현",
    color: "#c2a26b",
    modules: [
      { key: "patterns", name: "원어민 패턴", en: "Native Patterns", desc: "교과서에 없는, 원어민 대화의 뼈대가 되는 말투", icon: "chat", type: "lesson" },
      { key: "expressions", name: "원어민 표현", en: "Native Expressions", desc: "관용구와 연어(collocation), 뉘앙스까지", icon: "spark", type: "lesson" },
      { key: "reading", name: "리딩", en: "Reading C1–C2", desc: "칼럼과 에세이 수준의 글 읽기", icon: "book", type: "reading" },
      { key: "tenMinutes", name: "10분 코스", en: "Ten Minutes", desc: "하루 10문장, 짧은 단락 작문 (Day 15–20)", icon: "clock", type: "tenMinutes", lessonLevel: 3 }
    ]
  }
];
