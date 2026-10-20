// 병장 (CEFR C1–C2) 콘텐츠 — 껍데기. 형식은 js/content/private.js 머리말 참고.
globalThis.CONTENT = globalThis.CONTENT || {};
globalThis.CONTENT.sergeant = {
  patterns: [
    {
      id: "ap1",
      title: "It's not that ~, it's just that ~",
      ko: "오해를 풀며 진짜 이유 말하기",
      intro: "상대의 추측을 부드럽게 부정하고 진짜 이유를 덧붙이는 패턴. 거절이나 변명을 공격적이지 않게 만듭니다.",
      sections: [
        { type: "examples", items: [{ en: "It's not that I don't want to go, it's just that I'm exhausted.", ko: "가기 싫은 게 아니라, 그냥 너무 지쳐서 그래.", note: "직설적인 'I don't want to go'보다 훨씬 부드럽습니다." }] },
        { type: "quiz", items: [{ q: "이 패턴이 가장 자연스러운 상황은?", choices: ["주문할 때", "거절 이유를 부드럽게 설명할 때", "길을 물을 때", "감사 인사를 할 때"], answer: 1 }] }
      ]
    }
  ],
  expressions: [
    {
      id: "ae1",
      title: "on the fence",
      ko: "결정을 못 내리고 있는",
      intro: "울타리 위에 앉아 어느 쪽으로도 내려가지 못한 모습. 'I'm still on the fence about ~'로 씁니다.",
      sections: [
        { type: "examples", items: [{ en: "I'm still on the fence about taking the job.", ko: "그 일자리를 받을지 아직 결정을 못 했어." }] },
        { type: "quiz", items: [{ q: "'on the fence'의 뜻은?", choices: ["화가 난", "결정을 못 내린", "바쁜", "확신하는"], answer: 1 }] }
      ]
    }
  ],
  reading: [
    {
      id: "ar1",
      title: "The Case for Boredom",
      cefr: "C1",
      topic: "에세이",
      paragraphs: [
        "We have engineered boredom out of our lives with remarkable efficiency. Every idle moment, whether in a queue or on a train, is now filled by a glowing screen. Yet the mind that is never allowed to wander is also the mind that rarely stumbles upon an original thought. Boredom, it turns out, is not the absence of stimulation but the precondition for a certain kind of attention."
      ],
      glossary: [
        { w: "engineer (something) out of", ko: "~을 의도적으로 없애다" },
        { w: "stumble upon", ko: "우연히 발견하다" },
        { w: "precondition", ko: "전제 조건" }
      ],
      questions: [{ q: "What is the writer's main claim about boredom?", choices: ["It should be eliminated", "It is a precondition for original thought", "It only happens on trains", "Screens cure it"], answer: 1 }]
    }
  ]
};
