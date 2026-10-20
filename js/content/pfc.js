// 일병 (CEFR A2) 콘텐츠: 기초 문법 II · 생활 단어 러쉬 · 리딩 A2
// 단원(lesson) 형식: { id, title, ko, intro, sections: [...] }
//   sections[].type: "text" | "examples" | "pairs" | "table" | "quiz"
//   examples: { en, ko, note? } / pairs: { a, b, ko } / table: { head, rows } / quiz: { q, choices, answer(0부터), explain? }
// 리딩 형식: { id, title, cefr, topic, paragraphs, glossary: [{ w, ko }], questions: [quiz 형식] }
// 단어 러쉬 형식: { seconds, words: [{ en, ko }] } (단어 4개 이상)
// 단어 러쉬는 껍데기(단어 5개)입니다.
globalThis.CONTENT = globalThis.CONTENT || {};
globalThis.CONTENT.pfc = {
  grammar: [
    {
      id: "gr5",
      title: "현재진행형: be + -ing",
      ko: "지금 하고 있는 일",
      intro: "'지금 ~하고 있다'는 be동사 + 동사-ing. 매일 하는 일(현재형)과 지금 하는 일(진행형)을 구별하는 것이 핵심입니다.",
      sections: [
        {
          type: "examples",
          items: [
            { en: "I'm eating lunch now.", ko: "나 지금 점심 먹고 있어." },
            { en: "She's talking on the phone.", ko: "그녀는 통화 중이야." },
            { en: "What are you doing?", ko: "뭐 하고 있어?" },
            { en: "They aren't sleeping.", ko: "그들은 자고 있지 않아." },
            { en: "I eat lunch at noon. / I'm eating lunch now.", ko: "나는 (보통) 정오에 점심을 먹어. / 지금 점심 먹는 중이야." }
          ]
        },
        {
          type: "table",
          head: ["-ing 규칙", "예"],
          rows: [
            ["대부분 + ing", "eat → eating, go → going"],
            ["e로 끝나면 e 빼고 + ing", "make → making, write → writing"],
            ["짧은 모음 + 자음이면 자음 두 번", "run → running, sit → sitting, swim → swimming"]
          ]
        },
        {
          type: "quiz",
          items: [
            { q: "Look! It ___ outside.", choices: ["rain", "rains", "is raining", "raining"], answer: 2, explain: "지금 눈앞의 일 → be + -ing." },
            { q: "'run'의 -ing형은?", choices: ["runing", "running", "runeing", "runnning"], answer: 1, explain: "짧은 모음 + 자음 하나 → 자음을 두 번." },
            { q: "'나는 매일 아침 커피를 마셔'는?", choices: ["I'm drinking coffee every morning.", "I drink coffee every morning.", "I drinking coffee every morning.", "I am drink coffee every morning."], answer: 1, explain: "습관은 현재형. every morning이 힌트." }
          ]
        }
      ]
    },
    {
      id: "gr6",
      title: "과거형: -ed와 불규칙",
      ko: "어제 한 일 말하기",
      intro: "과거는 동사에 -ed를 붙입니다. 하지만 자주 쓰는 동사일수록 불규칙(go → went)입니다. 부정과 질문은 did를 쓰고 동사는 원형으로.",
      sections: [
        {
          type: "table",
          head: ["원형", "과거", "원형", "과거"],
          rows: [
            ["go", "went", "have", "had"],
            ["eat", "ate", "see", "saw"],
            ["come", "came", "get", "got"],
            ["take", "took", "make", "made"],
            ["buy", "bought", "think", "thought"],
            ["is / am", "was", "are", "were"]
          ]
        },
        {
          type: "examples",
          items: [
            { en: "I watched a movie last night.", ko: "어젯밤에 영화를 봤어." },
            { en: "We went to Busan last weekend.", ko: "지난 주말에 부산에 갔어." },
            { en: "I didn't go to work yesterday.", ko: "어제 출근 안 했어. (didn't + go)" },
            { en: "Did you have breakfast?", ko: "아침 먹었어?" },
            { en: "It was great.", ko: "좋았어." }
          ]
        },
        {
          type: "quiz",
          items: [
            { q: "She ___ to the park yesterday.", choices: ["go", "goes", "went", "gone"], answer: 2, explain: "yesterday → 과거. go의 과거는 went." },
            { q: "'나는 그것을 사지 않았어'는?", choices: ["I didn't bought it.", "I didn't buy it.", "I don't bought it.", "I not buy it."], answer: 1, explain: "didn't 뒤에는 원형." },
            { q: "'어제 비가 왔어?'는?", choices: ["Did it rain yesterday?", "Did it rained yesterday?", "Was it rain yesterday?", "Does it rain yesterday?"], answer: 0, explain: "Did + 주어 + 원형." }
          ]
        }
      ]
    },
    {
      id: "gr7",
      title: "can · will · want to",
      ko: "할 수 있다, 할 것이다, 하고 싶다",
      intro: "동사 앞에 can을 붙이면 '할 수 있다', will은 '할 것이다'. 뒤의 동사는 항상 원형입니다. '하고 싶다'는 want to + 동사.",
      sections: [
        {
          type: "examples",
          items: [
            { en: "I can swim.", ko: "나 수영할 수 있어." },
            { en: "Can you help me?", ko: "나 좀 도와줄 수 있어?" },
            { en: "I can't come tomorrow.", ko: "내일 못 와." },
            { en: "I'll call you later.", ko: "나중에 전화할게. (I will = I'll)" },
            { en: "It won't rain.", ko: "비 안 올 거야. (will not = won't)" },
            { en: "I want to learn English.", ko: "영어를 배우고 싶어." }
          ]
        },
        {
          type: "quiz",
          items: [
            { q: "She can ___ the piano.", choices: ["plays", "play", "playing", "to play"], answer: 1, explain: "can 뒤에는 항상 원형." },
            { q: "'나는 의사가 되고 싶어'는?", choices: ["I want be a doctor.", "I want to be a doctor.", "I want being a doctor.", "I want a doctor."], answer: 1, explain: "want to + 동사 원형." },
            { q: "'won't'는 무엇의 줄임말?", choices: ["want not", "will not", "would not", "was not"], answer: 1 }
          ]
        }
      ]
    },
    {
      id: "gr8",
      title: "의문사: what · where · when · who · why · how",
      ko: "질문의 첫 단어",
      intro: "의문사를 맨 앞에 두고, 그 뒤는 보통 질문 어순(be동사나 do/does/did가 주어 앞)입니다.",
      sections: [
        {
          type: "table",
          head: ["의문사", "뜻", "예"],
          rows: [
            ["What", "무엇", "What is this? / What do you do?"],
            ["Where", "어디", "Where are you from? / Where do you live?"],
            ["When", "언제", "When is your birthday?"],
            ["Who", "누구", "Who is she?"],
            ["Why", "왜", "Why are you late?"],
            ["How", "어떻게 / 얼마나", "How are you? / How much is it? / How old are you?"]
          ]
        },
        {
          type: "examples",
          items: [
            { en: "What time is it?", ko: "몇 시예요?" },
            { en: "Where did you buy it?", ko: "그거 어디서 샀어?" },
            { en: "How long does it take?", ko: "얼마나 걸려요?" },
            { en: "Why not?", ko: "왜 안 돼? / 좋지, 뭐." }
          ]
        },
        {
          type: "quiz",
          items: [
            { q: "___ is your phone number?", choices: ["Where", "What", "Who", "How"], answer: 1, explain: "번호가 '무엇'인지 → What." },
            { q: "'얼마예요?'는?", choices: ["How many is it?", "How much is it?", "What much is it?", "How price?"], answer: 1, explain: "가격은 How much." },
            { q: "'어디 살아?'는?", choices: ["Where you live?", "Where do you live?", "Where are you live?", "Where live you?"], answer: 1, explain: "의문사 + do + 주어 + 동사." }
          ]
        }
      ]
    }
  ],
  rush: {
    seconds: 60,
    words: [
      { en: "neighbor", ko: "이웃" },
      { en: "borrow", ko: "빌리다" },
      { en: "cheap", ko: "싼" },
      { en: "arrive", ko: "도착하다" },
      { en: "crowded", ko: "붐비는" }
    ]
  },
  reading: [
    {
      id: "rd3",
      title: "A Message to a Friend",
      cefr: "A2",
      topic: "메시지",
      paragraphs: ["Hi Jenny! How are you? I'm writing because I have good news. I got a new job! I start next Monday. The company is in Pangyo, so I'm going to move to a new apartment near there.", "The apartment is small but bright. It has a big window and a little kitchen. I don't have a sofa yet, so I'm going to buy one this weekend. Do you want to come with me? We can have lunch after shopping.", "Please text me when you're free. I miss you! — Sora"],
      glossary: [
        { w: "good news", ko: "좋은 소식" },
        { w: "move to", ko: "~로 이사하다" },
        { w: "bright", ko: "밝은" },
        { w: "yet", ko: "아직" },
        { w: "text me", ko: "문자해 줘" }
      ],
      questions: [
        { q: "Why is Sora writing?", choices: ["She is sad", "She has good news", "She needs money", "She lost her phone"], answer: 1 },
        { q: "What is Sora going to buy?", choices: ["A window", "A kitchen", "A sofa", "A car"], answer: 2 },
        { q: "What does Sora ask Jenny to do?", choices: ["Find a job", "Text her when free", "Cook lunch", "Move to Pangyo"], answer: 1 }
      ]
    },
    {
      id: "rd4",
      title: "The Weekend Market",
      cefr: "A2",
      topic: "쇼핑",
      paragraphs: ["Every Saturday, there is a market in the square near the river. It starts early, at seven, and finishes around one in the afternoon. Farmers bring fresh vegetables, fruit, and eggs. Some people sell bread, cheese, and honey.", "Last Saturday, I went there with my mother. We bought apples, a bag of potatoes, and some flowers for the kitchen table. The apples were cheaper than at the supermarket, and they tasted better too.", "After shopping, we sat by the river and ate warm bread. A man was playing the guitar. It was a simple morning, but we were very happy."],
      glossary: [
        { w: "square", ko: "광장" },
        { w: "farmer", ko: "농부" },
        { w: "cheaper than", ko: "~보다 싼" },
        { w: "taste", ko: "맛이 나다" },
        { w: "simple", ko: "소박한, 단순한" }
      ],
      questions: [
        { q: "When does the market finish?", choices: ["At seven", "Around one in the afternoon", "At night", "On Sunday"], answer: 1 },
        { q: "What did they NOT buy?", choices: ["Apples", "Potatoes", "Flowers", "Cheese"], answer: 3 },
        { q: "Why were the apples good?", choices: ["They were free", "They were cheaper and tasted better", "They were from the supermarket", "A man gave them"], answer: 1 }
      ]
    }
  ]
};
