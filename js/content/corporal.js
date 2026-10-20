// 상병 (CEFR B1–B2) 콘텐츠 — 껍데기. 형식은 js/content/private.js 머리말 참고.
// 단어 러쉬: words 배열에 { en, ko }를 추가하면 됩니다. 보기 4개는 다른 단어의 뜻에서 자동으로 뽑습니다 (최소 4개 필요).
globalThis.CONTENT = globalThis.CONTENT || {};
globalThis.CONTENT.corporal = {
  rush: {
    seconds: 60,
    words: [
      { en: "reliable", ko: "믿을 수 있는" },
      { en: "negotiate", ko: "협상하다" },
      { en: "deadline", ko: "마감 기한" },
      { en: "efficient", ko: "효율적인" },
      { en: "persuade", ko: "설득하다" }
    ]
  },
  grammar: [
    {
      id: "ig1",
      title: "현재완료: have + p.p.",
      ko: "과거가 지금까지 이어질 때",
      intro: "경험, 계속, 완료를 말할 때 씁니다. 과거형과의 차이는 '지금과 연결되어 있는가'입니다.",
      sections: [
        { type: "examples", items: [{ en: "I've lived in Seoul for ten years.", ko: "서울에 10년째 살고 있어요. (지금도 삽니다)" }] },
        { type: "quiz", items: [{ q: "I ___ my keys. I can't find them.", choices: ["lost", "have lost", "lose", "am losing"], answer: 1, explain: "잃어버린 결과가 지금까지 이어짐 → 현재완료." }] }
      ]
    }
  ],
  reading: [
    {
      id: "ir1",
      title: "Working From Home",
      cefr: "B1",
      topic: "직장",
      paragraphs: [
        "When my company let us work from home, I thought it would be easy. No commute, no noisy office, and I could wear whatever I wanted. The first week was great. By the second week, though, I realized I was working more hours than before, because there was no clear end to the day."
      ],
      glossary: [
        { w: "commute", ko: "통근" },
        { w: "realize", ko: "깨닫다" }
      ],
      questions: [{ q: "What problem did the writer notice in the second week?", choices: ["The office was noisy", "The commute was long", "There was no clear end to the day", "The clothes were uncomfortable"], answer: 2 }]
    }
  ]
};
