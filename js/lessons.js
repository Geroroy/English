// 커리큘럼 데이터: 하루 10문장 (핵심 8 + 교과서 밖 원어민 표현 2)
// level 1: 한 문장 작문 / level 2: 2~3문장 연결 / level 3: 짧은 단락 쓰기
// sentences[].native: 원어민은 자주 쓰지만 교과서에서는 배우기 힘든 표현. note에 설명.
// sentences[].scene: 장면 사진 검색어이자 화면의 슬레이트 문구.
// writing.require: 작문에 반드시 들어가야 하는 패턴(정규식, 대소문자 무시). 하나라도 맞으면 통과.
globalThis.LESSONS = [
  {
    id: 1,
    level: 1,
    title: "카페에서 주문하기",
    pattern: { en: "Can I get ~?", ko: "~ 주시겠어요? (주문할 때 가장 흔한 말)" },
    sentences: [
      { en: "Can I get an iced americano?", ko: "아이스 아메리카노 한 잔 주시겠어요?", tip: "가게에서 'I want ~'보다 훨씬 자연스러워요.", scene: "iced americano glass" },
      { en: "For here or to go?", ko: "드시고 가세요, 가져가세요?", tip: "점원이 자주 묻는 말. 'To go, please.'로 답해요.", scene: "cafe counter barista" },
      { en: "Can I get that in a large?", ko: "그거 큰 사이즈로 주실 수 있나요?", tip: "'in a + 사이즈'로 사이즈를 말해요.", scene: "large iced coffee" },
      { en: "Can I get a cafe latte?", ko: "카페라테 한 잔 주시겠어요?", scene: "latte art cup" },
      { en: "Can I get that in a small?", ko: "그거 작은 사이즈로 주실 수 있나요?", scene: "small espresso cup" },
      { en: "Can I get a glass of water?", ko: "물 한 잔 주시겠어요?", scene: "glass of water on table" },
      { en: "To go, please.", ko: "가져갈게요.", scene: "coffee to go cup" },
      { en: "Could you make it less sweet?", ko: "덜 달게 해 주실 수 있나요?", scene: "coffee and sugar" },
      { en: "I'm good, thanks.", ko: "(더 필요한 거 있냐고 물을 때) 괜찮아요, 됐어요.", native: true, note: "교과서는 'No, thank you'를 가르치지만, 실제로는 'I'm good'으로 가볍고 정중하게 거절하는 경우가 훨씬 많아요.", scene: "barista smiling" },
      { en: "That'll be it.", ko: "(주문을 마칠 때) 그게 다예요.", native: true, note: "'That's all'보다 자연스럽게 들려요. 'That'll be all'이라고도 해요.", scene: "cafe cashier counter" }
    ],
    dialogue: [
      { s: "A", en: "Hi, what can I get for you?", ko: "안녕하세요, 뭘 드릴까요?" },
      { s: "B", en: "Can I get an iced americano?", ko: "아이스 아메리카노 한 잔 주시겠어요?" },
      { s: "A", en: "Sure. For here or to go?", ko: "네. 드시고 가세요, 가져가세요?" },
      { s: "B", en: "To go, please.", ko: "가져갈게요." }
    ],
    writing: {
      prompt: "카페에서 마시고 싶은 음료를 'Can I get ~?'으로 주문해 보세요.",
      hints: ["a hot chocolate", "a green tea latte", "with oat milk", "in a medium"],
      require: ["can i get"],
      minWords: 4,
      samples: ["Can I get a hot chocolate with oat milk?", "Can I get a green tea latte in a medium?"]
    }
  },
  {
    id: 2,
    level: 1,
    title: "정중하게 부탁하기",
    pattern: { en: "Could you ~?", ko: "~해 주실 수 있나요? (Can you보다 정중)" },
    sentences: [
      { en: "Could you say that again?", ko: "다시 한번 말씀해 주시겠어요?", tip: "못 알아들었을 때 'What?' 대신 쓰세요.", scene: "two people talking" },
      { en: "Could you speak a little more slowly?", ko: "조금만 천천히 말씀해 주시겠어요?", tip: "'a little more'가 부드러운 느낌을 줘요.", scene: "slow conversation" },
      { en: "Could you help me with this?", ko: "이것 좀 도와주실 수 있나요?", tip: "'help + 사람 + with + 일'의 구조.", scene: "helping coworker desk" },
      { en: "Could you open the window?", ko: "창문 좀 열어 주실 수 있나요?", scene: "opening window" },
      { en: "Could you take a picture of me?", ko: "제 사진 좀 찍어 주실 수 있나요?", scene: "tourist taking photo" },
      { en: "Could you spell that for me?", ko: "그것 좀 철자를 불러 주실 수 있나요?", scene: "writing on notepad" },
      { en: "Could you hold the door, please?", ko: "문 좀 잡아 주시겠어요?", scene: "holding door entrance" },
      { en: "Could you send me the link?", ko: "링크 좀 보내 주실래요?", scene: "laptop sharing link" },
      { en: "Sorry, come again?", ko: "죄송한데, 뭐라고 하셨어요?", native: true, note: "'Pardon?'보다 일상에서 훨씬 많이 써요. 다시 한번 말해 달라는 가벼운 표현이에요.", scene: "confused conversation" },
      { en: "Could you hang on a sec?", ko: "잠깐만 기다려 주실래요?", native: true, note: "'Wait a moment'보다 자연스러워요. sec은 second의 줄임말이에요.", scene: "phone call waiting" }
    ],
    dialogue: [
      { s: "A", en: "The meeting room is on the third floor, next to the elevator.", ko: "회의실은 3층 엘리베이터 옆이에요." },
      { s: "B", en: "Sorry, could you say that again?", ko: "죄송한데, 다시 한번 말씀해 주시겠어요?" },
      { s: "A", en: "Sure. Third floor, next to the elevator.", ko: "네. 3층, 엘리베이터 옆이요." },
      { s: "B", en: "Got it. Thank you so much.", ko: "알겠어요. 정말 감사합니다." }
    ],
    writing: {
      prompt: "동료나 친구에게 부탁하고 싶은 일 하나를 'Could you ~?'로 써 보세요.",
      hints: ["send me the file", "check this email", "turn down the music", "pick me up"],
      require: ["could you"],
      minWords: 4,
      samples: ["Could you send me the file by tomorrow?", "Could you turn down the music a little?"]
    }
  },
  {
    id: 3,
    level: 1,
    title: "하고 싶은 것 말하기",
    pattern: { en: "I'd like to ~", ko: "~하고 싶어요 (I want to보다 정중)" },
    sentences: [
      { en: "I'd like to make a reservation.", ko: "예약을 하고 싶어요.", tip: "식당, 호텔, 병원 어디서나 써요.", scene: "restaurant reservation" },
      { en: "I'd like to check in, please.", ko: "체크인하고 싶어요.", tip: "호텔 프런트에서 첫마디로 딱 좋아요.", scene: "hotel front desk" },
      { en: "I'd like to try something new.", ko: "새로운 걸 시도해 보고 싶어요.", tip: "일상 대화에서도 자연스러워요.", scene: "trying new food" },
      { en: "I'd like to get a refund.", ko: "환불을 받고 싶어요.", scene: "store refund counter" },
      { en: "I'd like to try this on.", ko: "이걸 입어 보고 싶어요.", scene: "fitting room mirror" },
      { en: "I'd like to change my reservation.", ko: "제 예약을 바꾸고 싶어요.", scene: "calendar booking" },
      { en: "I'd like a table for two, please.", ko: "두 명 자리 부탁해요.", scene: "restaurant table for two" },
      { en: "I'd like to pay by card.", ko: "카드로 계산할게요.", scene: "card payment terminal" },
      { en: "I've been dying to try this place.", ko: "여기 진짜 와 보고 싶었어요.", native: true, note: "'be dying to'는 '~하고 싶어 죽겠다'는 뜻으로, 원어민이 정말 자주 써요.", scene: "new restaurant entrance" },
      { en: "I'll go with the steak.", ko: "스테이크로 할게요.", native: true, note: "메뉴를 고를 때 'I'll have ~'와 함께 가장 많이 쓰는 말이에요. 'go with'는 '~로 정하다'.", scene: "steak dinner" }
    ],
    dialogue: [
      { s: "A", en: "Good evening. How can I help you?", ko: "안녕하세요. 무엇을 도와드릴까요?" },
      { s: "B", en: "Hi, I'd like to make a reservation for two.", ko: "안녕하세요, 두 명 예약하고 싶어요." },
      { s: "A", en: "What time would you like?", ko: "몇 시로 해 드릴까요?" },
      { s: "B", en: "Seven o'clock, if possible.", ko: "가능하면 7시요." }
    ],
    writing: {
      prompt: "이번 주말에 하고 싶은 일을 'I'd like to ~'로 써 보세요.",
      hints: ["visit", "learn how to", "spend time with", "go hiking"],
      require: ["i'd like to", "i would like to", "i’d like to"],
      minWords: 5,
      samples: ["I'd like to go hiking with my friends this weekend.", "I'd like to learn how to bake bread this weekend."]
    }
  },
  {
    id: 4,
    level: 1,
    title: "계획 말하기",
    pattern: { en: "I'm going to ~ / I'm planning to ~", ko: "~할 거예요 / ~할 계획이에요" },
    sentences: [
      { en: "I'm going to stay home tonight.", ko: "오늘 밤엔 집에 있을 거예요.", tip: "이미 정한 계획엔 'be going to'.", scene: "cozy home evening" },
      { en: "I'm planning to visit Busan next month.", ko: "다음 달에 부산에 갈 계획이에요.", tip: "'planning'은 계획 중이라는 느낌.", scene: "busan beach" },
      { en: "What are you going to do this weekend?", ko: "이번 주말에 뭐 할 거예요?", tip: "대화를 시작하기 좋은 질문.", scene: "weekend plans" },
      { en: "I'm going to get up early tomorrow.", ko: "저는 내일 일찍 일어날 거예요.", scene: "alarm clock morning" },
      { en: "I'm planning to start working out.", ko: "저는 운동을 시작할 계획이에요.", scene: "gym workout" },
      { en: "What are you going to do tonight?", ko: "오늘 밤에 뭐 할 거예요?", scene: "city night" },
      { en: "I'm going to take Friday off.", ko: "금요일에 휴가 낼 거예요.", scene: "office calendar" },
      { en: "We're planning to move next year.", ko: "우리 내년에 이사할 계획이에요.", scene: "moving boxes" },
      { en: "What are you up to this weekend?", ko: "이번 주말에 뭐 해?", native: true, note: "'What will you do?' 대신 원어민은 거의 이렇게 물어요.", scene: "friends chatting" },
      { en: "I'm just gonna chill at home.", ko: "그냥 집에서 쉬려고.", native: true, note: "'chill'은 느긋하게 쉬다, 'gonna'는 going to의 구어체예요.", scene: "relaxing on sofa" }
    ],
    dialogue: [
      { s: "A", en: "What are you going to do this weekend?", ko: "이번 주말에 뭐 할 거예요?" },
      { s: "B", en: "I'm going to clean my room and rest.", ko: "방 청소하고 쉴 거예요." },
      { s: "A", en: "Sounds relaxing. I'm planning to go camping.", ko: "편하겠네요. 저는 캠핑 갈 계획이에요." },
      { s: "B", en: "Nice! Have fun.", ko: "좋네요! 재밌게 보내요." }
    ],
    writing: {
      prompt: "다음 주 계획 하나를 'I'm going to ~' 또는 'I'm planning to ~'로 써 보세요.",
      hints: ["meet my parents", "finish my project", "take a day off", "next Friday"],
      require: ["going to", "planning to"],
      minWords: 5,
      samples: ["I'm going to meet my parents next Friday.", "I'm planning to take a day off next week."]
    }
  },
  {
    id: 5,
    level: 1,
    title: "경험 묻고 답하기",
    pattern: { en: "Have you ever ~?", ko: "~해 본 적 있어요?" },
    sentences: [
      { en: "Have you ever been to Japan?", ko: "일본에 가 본 적 있어요?", tip: "'가 봤다'는 'been to'를 써요.", scene: "tokyo street" },
      { en: "I've never tried it before.", ko: "전에 한 번도 해 본 적 없어요.", tip: "'I've never + 과거분사'.", scene: "mexican tacos" },
      { en: "I've done it a couple of times.", ko: "몇 번 해 봤어요.", tip: "'a couple of times' = 두어 번.", scene: "surfing waves" },
      { en: "Have you ever done a bungee jump?", ko: "번지점프 해 본 적 있어요?", scene: "bungee jump" },
      { en: "I've never been to Europe.", ko: "저는 유럽에 가 본 적이 없어요.", scene: "eiffel tower" },
      { en: "Have you ever seen that movie?", ko: "그 영화 본 적 있어요?", scene: "movie theater" },
      { en: "Have you ever met anyone famous?", ko: "유명한 사람 만나 본 적 있어요?", scene: "red carpet" },
      { en: "I've been there twice.", ko: "거기 두 번 가 봤어요.", scene: "travel map" },
      { en: "It's on my bucket list.", ko: "꼭 해 보고 싶은 것 중 하나예요.", native: true, note: "버킷리스트는 원어민의 일상 표현이에요. 'I want to do it someday'보다 가볍고 자연스러워요.", scene: "bucket list notebook" },
      { en: "Been there, done that.", ko: "이미 다 해 봤지.", native: true, note: "'더 이상 새롭지 않다'는 느낌의 관용구예요. 앞의 I've를 빼고 말해요.", scene: "tired traveler" }
    ],
    dialogue: [
      { s: "A", en: "Have you ever tried Mexican food?", ko: "멕시코 음식 먹어 본 적 있어요?" },
      { s: "B", en: "No, I've never tried it before.", ko: "아니요, 한 번도 안 먹어 봤어요." },
      { s: "A", en: "You should! There's a great place near here.", ko: "꼭 먹어 봐요! 이 근처에 맛집 있어요." },
      { s: "B", en: "Really? Let's go sometime.", ko: "정말요? 언제 같이 가요." }
    ],
    writing: {
      prompt: "친구에게 'Have you ever ~?'로 경험을 물어보세요.",
      hints: ["been to", "eaten", "watched", "played"],
      require: ["have you ever"],
      minWords: 4,
      samples: ["Have you ever been to Jeju Island?", "Have you ever played tennis?"]
    }
  },
  {
    id: 6,
    level: 1,
    title: "제안하기",
    pattern: { en: "Why don't we ~? / How about ~ing?", ko: "우리 ~하는 게 어때요?" },
    sentences: [
      { en: "Why don't we grab lunch together?", ko: "우리 같이 점심 먹는 게 어때요?", tip: "'grab' = 가볍게 먹다/마시다.", scene: "lunch with coworkers" },
      { en: "How about meeting at six?", ko: "6시에 만나는 거 어때요?", tip: "How about 뒤에는 -ing!", scene: "clock six" },
      { en: "That sounds good to me.", ko: "저는 좋아요.", tip: "제안에 찬성할 때.", scene: "friends high five" },
      { en: "Why don't we take a taxi?", ko: "우리 택시 타는 게 어때요?", scene: "taxi city street" },
      { en: "How about trying again tomorrow?", ko: "내일 다시 해 보는 거 어때요?", scene: "trying again" },
      { en: "Why don't we take a break?", ko: "우리 잠깐 쉬는 게 어때요?", scene: "coffee break" },
      { en: "Let's meet in front of the station.", ko: "역 앞에서 만나요.", scene: "train station entrance" },
      { en: "How about Thursday instead?", ko: "대신 목요일은 어때요?", scene: "calendar planning" },
      { en: "Wanna grab a bite?", ko: "간단히 뭐 좀 먹을래?", native: true, note: "'grab a bite'는 가볍게 먹다, 'wanna'는 want to의 구어체예요.", scene: "street food" },
      { en: "I'm down.", ko: "좋아, 콜!", native: true, note: "제안에 'Yes, I agree' 대신 쓰는 아주 흔한 구어예요. 'I'm down for that'도 같은 뜻이에요.", scene: "friends agreeing" }
    ],
    dialogue: [
      { s: "A", en: "I'm so hungry. Why don't we grab lunch together?", ko: "너무 배고파요. 같이 점심 먹을래요?" },
      { s: "B", en: "Sure. How about trying the new pasta place?", ko: "좋아요. 새로 생긴 파스타집 가 보는 거 어때요?" },
      { s: "A", en: "That sounds good to me.", ko: "좋아요." },
      { s: "B", en: "Great. Let's go at noon.", ko: "좋아요. 12시에 가요." }
    ],
    writing: {
      prompt: "친구에게 같이 하고 싶은 일을 'Why don't we ~?' 또는 'How about ~ing?'으로 제안해 보세요.",
      hints: ["watch a movie", "go for a walk", "order pizza", "this Saturday"],
      require: ["why don't we", "why don’t we", "how about"],
      minWords: 4,
      samples: ["Why don't we watch a movie this Saturday?", "How about going for a walk after dinner?"]
    }
  },
  {
    id: 7,
    level: 1,
    title: "길 묻기",
    pattern: { en: "How do I get to ~? / Where can I find ~?", ko: "~에 어떻게 가요? / ~은 어디 있어요?" },
    sentences: [
      { en: "Excuse me, how do I get to the subway station?", ko: "실례지만, 지하철역에 어떻게 가요?", tip: "모르는 사람에겐 'Excuse me'로 시작.", scene: "subway station" },
      { en: "Where can I find the restroom?", ko: "화장실이 어디 있나요?", tip: "'Where is ~?'보다 부드러워요.", scene: "restroom sign" },
      { en: "Is it within walking distance?", ko: "걸어갈 수 있는 거리인가요?", tip: "'walking distance' = 도보 거리.", scene: "walking city street" },
      { en: "How do I get to the airport?", ko: "공항에 어떻게 가요?", scene: "airport terminal" },
      { en: "Where can I find the elevator?", ko: "엘리베이터는 어디 있나요?", scene: "elevator lobby" },
      { en: "Is it far from here?", ko: "여기서 멀어요?", scene: "city map" },
      { en: "Which way is the exit?", ko: "출구가 어느 쪽이에요?", scene: "exit sign" },
      { en: "How long does it take to get there?", ko: "거기까지 얼마나 걸려요?", scene: "walking directions" },
      { en: "It's just around the corner.", ko: "바로 근처예요.", native: true, note: "모퉁이만 돌면 있을 만큼 가깝다는 뜻이에요. '곧 다가온다'는 뜻으로도 써요.", scene: "street corner" },
      { en: "You can't miss it.", ko: "바로 보일 거예요.", native: true, note: "길을 알려 준 뒤 덧붙이는 말이에요. '놓칠 수가 없다', 즉 찾기 쉽다는 뜻이에요.", scene: "landmark building" }
    ],
    dialogue: [
      { s: "A", en: "Excuse me, how do I get to City Hall?", ko: "실례지만, 시청에 어떻게 가요?" },
      { s: "B", en: "Go straight and turn left at the second light.", ko: "직진하다가 두 번째 신호등에서 좌회전하세요." },
      { s: "A", en: "Is it within walking distance?", ko: "걸어갈 수 있는 거리예요?" },
      { s: "B", en: "Yes, it's about ten minutes on foot.", ko: "네, 걸어서 10분 정도예요." }
    ],
    writing: {
      prompt: "여행지에서 가고 싶은 곳으로 가는 길을 영어로 물어보세요.",
      hints: ["the nearest bus stop", "the museum", "a pharmacy", "Excuse me,"],
      require: ["how do i get to", "where can i find"],
      minWords: 5,
      samples: ["Excuse me, how do I get to the museum?", "Excuse me, where can I find a pharmacy?"]
    }
  },
  {
    id: 8,
    level: 2,
    title: "내 생각 말하기",
    pattern: { en: "I think ~ / In my opinion, ~", ko: "제 생각엔 ~ / 제 의견으로는 ~" },
    sentences: [
      { en: "I think it's a good idea.", ko: "좋은 생각인 것 같아요.", tip: "'I think'는 단정 대신 부드럽게 말하는 도구예요.", scene: "idea lightbulb" },
      { en: "In my opinion, it's too expensive.", ko: "제 생각엔 너무 비싸요.", tip: "조금 더 격식 있는 표현.", scene: "expensive price tag" },
      { en: "I don't think that's true.", ko: "그건 사실이 아닌 것 같아요.", tip: "영어는 'I think ~ not'보다 'I don't think ~'를 써요.", scene: "skeptical face" },
      { en: "I think that's the best way.", ko: "그게 최선의 방법인 것 같아요.", scene: "road ahead" },
      { en: "I don't think he will come.", ko: "그가 올 것 같지 않아요.", scene: "empty doorway" },
      { en: "In my opinion, this book is more interesting.", ko: "제 생각엔 이 책이 더 재미있어요.", scene: "reading book" },
      { en: "I totally agree with you.", ko: "전적으로 동의해요.", scene: "handshake" },
      { en: "I see your point, but I think differently.", ko: "무슨 말인지 알지만, 제 생각은 달라요.", scene: "discussion meeting" },
      { en: "I'm on the fence.", ko: "아직 마음을 못 정했어요.", native: true, note: "울타리 위에 앉아 어느 쪽으로도 내려오지 않은 상태, 즉 결정을 못 했다는 뜻이에요.", scene: "wooden fence" },
      { en: "Fair enough.", ko: "그럴 만하네요.", native: true, note: "상대 말을 인정할 때 쓰는 맞장구예요. 'You are right'보다 훨씬 자연스러워요.", scene: "nodding conversation" }
    ],
    dialogue: [
      { s: "A", en: "What do you think about working from home?", ko: "재택근무에 대해 어떻게 생각해요?" },
      { s: "B", en: "I think it's great. I save a lot of time.", ko: "좋다고 생각해요. 시간이 많이 절약돼요." },
      { s: "A", en: "In my opinion, it's a little lonely.", ko: "제 생각엔 좀 외로운 것 같아요." },
      { s: "B", en: "That's true. I miss my coworkers sometimes.", ko: "맞아요. 가끔 동료들이 보고 싶어요." }
    ],
    writing: {
      prompt: "'스마트폰은 우리 삶을 더 좋게 만들까?'에 대한 생각을 2문장으로 써 보세요. 첫 문장은 의견, 두 번째 문장은 덧붙이는 말.",
      hints: ["I think ~", "make our lives easier", "spend too much time", "Also, ~"],
      require: ["i think", "in my opinion", "i don't think", "i don’t think"],
      minWords: 10,
      samples: ["I think smartphones make our lives easier. We can find information anywhere.", "In my opinion, smartphones are useful but risky. Many people spend too much time on them."]
    }
  },
  {
    id: 9,
    level: 2,
    title: "이유 말하기",
    pattern: { en: "~ because ~ / That's why ~", ko: "~때문에 ~ / 그래서 ~한 거예요" },
    sentences: [
      { en: "I was late because the bus didn't come.", ko: "버스가 안 와서 늦었어요.", tip: "because 뒤에는 '주어 + 동사'.", scene: "waiting at bus stop" },
      { en: "That's why I called you.", ko: "그래서 전화한 거예요.", tip: "앞에서 말한 내용을 이유로 연결해요.", scene: "phone call" },
      { en: "It's because I'm tired.", ko: "제가 피곤해서 그래요.", tip: "이유만 따로 말할 때.", scene: "tired on sofa" },
      { en: "I stayed home because it was raining.", ko: "비가 와서 집에 있었어요.", scene: "rainy window" },
      { en: "That's why I study English.", ko: "그래서 영어를 공부해요.", scene: "studying books" },
      { en: "It's because I'm hungry.", ko: "배가 고파서 그래요.", scene: "burger" },
      { en: "I couldn't come because I was sick.", ko: "아파서 못 왔어요.", scene: "sick in bed" },
      { en: "So that's why you were late!", ko: "그래서 늦었구나!", scene: "late to office" },
      { en: "Long story short, I missed the train.", ko: "간단히 말하면, 기차를 놓쳤어요.", native: true, note: "긴 사연을 짧게 줄일 때 문장 앞에 붙여요.", scene: "train platform" },
      { en: "The thing is, I'm really busy this week.", ko: "사실은요, 이번 주에 정말 바빠요.", native: true, note: "곤란한 이유를 꺼낼 때 'The thing is,'로 시작해요. 부드럽게 사정을 설명하는 신호예요.", scene: "busy desk" }
    ],
    dialogue: [
      { s: "A", en: "You look tired today.", ko: "오늘 피곤해 보여요." },
      { s: "B", en: "I couldn't sleep because my neighbor was so noisy.", ko: "이웃이 너무 시끄러워서 잠을 못 잤어요." },
      { s: "A", en: "Oh no. That's why you look so sleepy.", ko: "저런. 그래서 그렇게 졸려 보이는군요." },
      { s: "B", en: "Yeah, I need a strong coffee.", ko: "네, 진한 커피가 필요해요." }
    ],
    writing: {
      prompt: "영어를 공부하는 이유를 2~3문장으로 써 보세요. 'because'를 꼭 사용하세요.",
      hints: ["travel abroad", "for my job", "talk with people from other countries", "That's why ~"],
      require: ["because"],
      minWords: 10,
      samples: ["I study English because I want to travel abroad. I'd like to talk with people from other countries. That's why I practice every day.", "I'm learning English because I need it for my job. I often write emails to foreign clients."]
    }
  },
  {
    id: 10,
    level: 2,
    title: "감정 표현하기",
    pattern: { en: "I'm excited / worried / nervous about ~", ko: "~ 때문에 설레요 / 걱정돼요 / 긴장돼요" },
    sentences: [
      { en: "I'm so excited about the trip.", ko: "여행 때문에 너무 설레요.", tip: "about 뒤에 명사나 -ing.", scene: "airport travel" },
      { en: "I'm a little worried about the interview.", ko: "면접이 좀 걱정돼요.", tip: "'a little'로 정도를 조절해요.", scene: "job interview" },
      { en: "I'm nervous about speaking in public.", ko: "사람들 앞에서 말하는 게 긴장돼요.", tip: "about + -ing 형태.", scene: "public speaking" },
      { en: "I'm excited about my new job.", ko: "저는 새 직장 때문에 설레요.", scene: "first day at work" },
      { en: "I'm worried about the exam.", ko: "저는 시험이 걱정돼요.", scene: "exam studying" },
      { en: "I'm nervous about driving.", ko: "저는 운전하는 게 긴장돼요.", scene: "driving car" },
      { en: "I'm really looking forward to it.", ko: "정말 기대돼요.", scene: "concert crowd" },
      { en: "Don't worry, you'll be fine.", ko: "걱정 마, 잘될 거야.", scene: "friend comforting" },
      { en: "I'm so stoked!", ko: "완전 신나!", native: true, note: "'very excited'의 구어예요. 미국에서 특히 많이 써요.", scene: "celebration" },
      { en: "I've got butterflies in my stomach.", ko: "긴장돼서 속이 울렁거려요.", native: true, note: "중요한 일을 앞두고 떨릴 때 써요. 뱃속에 나비가 날아다니는 느낌이에요.", scene: "backstage nervous" }
    ],
    dialogue: [
      { s: "A", en: "Your interview is tomorrow, right?", ko: "내일 면접이죠?" },
      { s: "B", en: "Yes. I'm a little worried about it.", ko: "네. 좀 걱정돼요." },
      { s: "A", en: "Don't worry. You'll do great.", ko: "걱정 마요. 잘할 거예요." },
      { s: "B", en: "Thanks. That makes me feel better.", ko: "고마워요. 기분이 좀 나아지네요." }
    ],
    writing: {
      prompt: "요즘 설레거나 걱정되는 일을 2~3문장으로 써 보세요. 왜 그런지 이유도 덧붙이세요.",
      hints: ["I'm excited about ~", "I'm worried about ~", "because ~", "next week"],
      require: ["excited about", "worried about", "nervous about"],
      minWords: 10,
      samples: ["I'm excited about my trip to Vietnam next week. I've never been there before.", "I'm worried about my presentation on Friday. I'm nervous because I'm not good at speaking in public."]
    }
  },
  {
    id: 11,
    level: 2,
    title: "습관과 일상",
    pattern: { en: "I usually ~ / I tend to ~", ko: "저는 보통 ~해요 / ~하는 편이에요" },
    sentences: [
      { en: "I usually get up at seven.", ko: "저는 보통 7시에 일어나요.", tip: "빈도부사는 일반동사 앞에.", scene: "morning alarm" },
      { en: "I tend to stay up late.", ko: "저는 늦게 자는 편이에요.", tip: "'tend to' = ~하는 경향이 있다.", scene: "phone at night" },
      { en: "I hardly ever eat breakfast.", ko: "저는 아침을 거의 안 먹어요.", tip: "'hardly ever' = 거의 ~ 않다.", scene: "breakfast table" },
      { en: "I usually go to work by subway.", ko: "저는 보통 지하철로 출근해요.", scene: "subway commute" },
      { en: "I tend to eat too much.", ko: "저는 너무 많이 먹는 편이에요.", scene: "pizza" },
      { en: "I hardly ever drink coffee.", ko: "저는 커피를 거의 안 마셔요.", scene: "cup of tea" },
      { en: "I work out three times a week.", ko: "일주일에 세 번 운동해요.", scene: "gym training" },
      { en: "I always check my phone first thing in the morning.", ko: "아침에 일어나자마자 항상 휴대폰을 봐요.", scene: "phone in bed" },
      { en: "I'm not a morning person.", ko: "저는 아침형 인간이 아니에요.", native: true, note: "'I can't wake up early'보다 원어민이 즐겨 쓰는 자기소개 표현이에요.", scene: "sleepy morning coffee" },
      { en: "I'm a total night owl.", ko: "저는 완전 올빼미족이에요.", native: true, note: "night owl은 밤에 활동하는 사람이에요. 반대는 early bird예요.", scene: "city lights at night" }
    ],
    dialogue: [
      { s: "A", en: "What do you usually do after work?", ko: "퇴근 후에 보통 뭐 해요?" },
      { s: "B", en: "I usually go to the gym. How about you?", ko: "보통 헬스장 가요. 당신은요?" },
      { s: "A", en: "I tend to just watch TV at home.", ko: "저는 그냥 집에서 TV 보는 편이에요." },
      { s: "B", en: "That sounds nice, too.", ko: "그것도 좋네요." }
    ],
    writing: {
      prompt: "평소 아침 루틴을 2~3문장으로 써 보세요.",
      hints: ["I usually ~", "and then ~", "I tend to ~", "before work"],
      require: ["usually", "tend to", "always", "often", "hardly ever", "never"],
      minWords: 12,
      samples: ["I usually get up at 6:30 and drink a glass of water. Then I take a quick shower. I tend to skip breakfast because I'm always in a hurry."]
    }
  },
  {
    id: 12,
    level: 2,
    title: "허락 구하기",
    pattern: { en: "Is it okay if I ~? / Do you mind if I ~?", ko: "~해도 될까요?" },
    sentences: [
      { en: "Is it okay if I sit here?", ko: "여기 앉아도 될까요?", tip: "가장 무난한 허락 표현.", scene: "empty cafe seat" },
      { en: "Do you mind if I open the window?", ko: "창문 좀 열어도 될까요?", tip: "허락할 땐 'No, go ahead.' (꺼리지 않아요)", scene: "opening window" },
      { en: "Go ahead.", ko: "그러세요.", tip: "허락해 줄 때 짧게.", scene: "welcoming gesture" },
      { en: "Is it okay if I leave early?", ko: "일찍 가도 될까요?", scene: "leaving office" },
      { en: "Do you mind if I ask a question?", ko: "질문 하나 해도 될까요?", scene: "raising hand" },
      { en: "Is it okay if I use this pen?", ko: "이 펜 써도 될까요?", scene: "pen on desk" },
      { en: "Can I borrow your charger?", ko: "충전기 좀 빌려도 될까요?", scene: "phone charger" },
      { en: "Is it okay if I bring a friend?", ko: "친구 데려가도 괜찮아요?", scene: "dinner party" },
      { en: "Mind if I tag along?", ko: "나도 따라가도 돼?", native: true, note: "'tag along'은 따라가다, 끼다라는 뜻이에요. 앞의 'Do you'를 빼고 말해요.", scene: "friends walking" },
      { en: "Knock yourself out.", ko: "얼마든지, 마음껏 해.", native: true, note: "직역하면 '기절해라'지만 '원하는 만큼 해'라는 허락이에요. 교과서에는 거의 안 나와요.", scene: "generous host" }
    ],
    dialogue: [
      { s: "A", en: "Excuse me, is it okay if I sit here?", ko: "실례지만, 여기 앉아도 될까요?" },
      { s: "B", en: "Sure, go ahead.", ko: "그럼요, 앉으세요." },
      { s: "A", en: "Thanks. Do you mind if I charge my phone here?", ko: "감사해요. 여기서 휴대폰 충전해도 될까요?" },
      { s: "B", en: "Not at all.", ko: "전혀요. (괜찮아요)" }
    ],
    writing: {
      prompt: "상사에게 내일 재택근무를 해도 되는지 2문장으로 물어보세요. 이유도 함께요.",
      hints: ["work from home", "because ~", "I have a doctor's appointment", "Is it okay if I ~?"],
      require: ["is it okay if", "do you mind if", "can i", "could i"],
      minWords: 10,
      samples: ["Is it okay if I work from home tomorrow? I have a doctor's appointment in the morning.", "Do you mind if I work from home tomorrow? My son is sick, so I need to stay with him."]
    }
  },
  {
    id: 13,
    level: 2,
    title: "지난 일 이야기하기",
    pattern: { en: "I ended up ~ing", ko: "결국 ~하게 됐어요" },
    sentences: [
      { en: "I ended up staying home all day.", ko: "결국 하루 종일 집에 있게 됐어요.", tip: "계획과 다른 결과를 말할 때 최고.", scene: "rainy day movies" },
      { en: "It was a lot of fun.", ko: "정말 재미있었어요.", tip: "'a lot of fun' — 'very fun'보다 자연스러워요.", scene: "party with friends" },
      { en: "How was your weekend?", ko: "주말 어땠어요?", tip: "월요일 스몰토크 1순위.", scene: "weekend morning" },
      { en: "I ended up taking a taxi.", ko: "결국 택시를 타게 됐어요.", scene: "taxi at night" },
      { en: "I had dinner with my friends.", ko: "저는 친구들과 저녁을 먹었어요.", scene: "dinner with friends" },
      { en: "How was your day yesterday?", ko: "어제 어땠어요?", scene: "city yesterday" },
      { en: "We got there just in time.", ko: "우리 딱 맞춰 도착했어요.", scene: "running to catch train" },
      { en: "It turned out to be a great day.", ko: "결국 좋은 하루였어요.", scene: "sunset" },
      { en: "It was a blast.", ko: "완전 재밌었어.", native: true, note: "'It was fun'보다 훨씬 생생한 표현이에요. blast는 신나는 시간이라는 뜻이에요.", scene: "friends laughing" },
      { en: "I totally crashed.", ko: "완전 뻗었어.", native: true, note: "피곤해서 쓰러지듯 잠들었을 때 써요. 'I fell asleep'의 구어예요.", scene: "sleeping exhausted" }
    ],
    dialogue: [
      { s: "A", en: "How was your weekend?", ko: "주말 어땠어요?" },
      { s: "B", en: "I wanted to go hiking, but it rained.", ko: "등산 가려고 했는데 비가 왔어요." },
      { s: "A", en: "Oh, so what did you do?", ko: "아, 그래서 뭐 했어요?" },
      { s: "B", en: "I ended up watching movies all day. It was a lot of fun.", ko: "결국 하루 종일 영화 봤어요. 정말 재미있었어요." }
    ],
    writing: {
      prompt: "지난 주말에 있었던 일을 2~3문장으로 써 보세요. 과거형을 쓰고, 가능하면 'ended up'을 넣어 보세요.",
      hints: ["I went to ~", "I was going to ~, but ~", "I ended up ~ing", "It was ~"],
      require: ["ended up", "went", "was", "had", "did"],
      minWords: 12,
      samples: ["I was going to clean my house last Saturday, but my friend called me. We ended up going to a new cafe downtown. It was a lot of fun."]
    }
  },
  {
    id: 14,
    level: 2,
    title: "조언하기",
    pattern: { en: "You should ~ / If I were you, I'd ~", ko: "~하는 게 좋겠어요 / 내가 너라면 ~할 거야" },
    sentences: [
      { en: "You should get some rest.", ko: "좀 쉬는 게 좋겠어요.", tip: "should는 '해야 한다'보다 '~하는 게 좋겠다'에 가까워요.", scene: "resting in bed" },
      { en: "If I were you, I'd talk to him.", ko: "내가 너라면 그 사람이랑 얘기해 볼 거야.", tip: "가정이라 'I was'가 아닌 'I were'.", scene: "friends talking" },
      { en: "Maybe you should see a doctor.", ko: "병원에 가 보는 게 좋겠어요.", tip: "'Maybe'를 붙이면 더 부드러워요.", scene: "doctor visit" },
      { en: "You should drink more water.", ko: "물을 더 마시는 게 좋겠어요.", scene: "drinking water" },
      { en: "If I were you, I wouldn't buy it.", ko: "내가 너라면 그거 안 살 거야.", scene: "shopping decision" },
      { en: "You should go to bed early.", ko: "일찍 자는 게 좋겠어요.", scene: "bedtime" },
      { en: "You'd better leave now.", ko: "지금 출발하는 게 좋겠어요.", scene: "leaving home" },
      { en: "Why don't you take a few days off?", ko: "며칠 쉬는 게 어때요?", scene: "vacation" },
      { en: "Take it easy.", ko: "무리하지 마.", native: true, note: "헤어질 때 인사로도 써요. 'Don't work too hard'의 자연스러운 버전이에요.", scene: "friend waving" },
      { en: "Sleep on it.", ko: "하룻밤 자면서 생각해 봐.", native: true, note: "중요한 결정을 서두르지 말라는 조언이에요.", scene: "thinking at night" }
    ],
    dialogue: [
      { s: "A", en: "I've had a headache for three days.", ko: "3일째 두통이 있어요." },
      { s: "B", en: "Maybe you should see a doctor.", ko: "병원에 가 보는 게 좋겠어요." },
      { s: "A", en: "I'm too busy this week.", ko: "이번 주는 너무 바빠요." },
      { s: "B", en: "If I were you, I'd go today. Your health comes first.", ko: "내가 당신이라면 오늘 갈 거예요. 건강이 먼저예요." }
    ],
    writing: {
      prompt: "친구가 '요즘 너무 스트레스 받아'라고 합니다. 조언을 2~3문장으로 써 보세요.",
      hints: ["You should ~", "If I were you, I'd ~", "take a walk", "talk to someone"],
      require: ["you should", "if i were you", "maybe you"],
      minWords: 12,
      samples: ["You should take a short walk every day. It really helps. If I were you, I'd also turn off my phone before bed."]
    }
  },
  {
    id: 15,
    level: 3,
    title: "비교하고 선호 말하기",
    pattern: { en: "I prefer A to B / A is better than B", ko: "B보다 A가 좋아요 / A가 B보다 나아요" },
    sentences: [
      { en: "I prefer tea to coffee.", ko: "저는 커피보다 차가 좋아요.", tip: "prefer A to B — 'than'이 아니라 'to'!", scene: "tea and coffee" },
      { en: "This one is much cheaper than that one.", ko: "이게 저것보다 훨씬 싸요.", tip: "비교급 강조는 'much'.", scene: "price tags" },
      { en: "Both are good, but I'd go with this one.", ko: "둘 다 좋은데, 저는 이걸로 할래요.", tip: "'go with' = 고르다, 선택하다.", scene: "clothing store" },
      { en: "I prefer summer to winter.", ko: "저는 겨울보다 여름이 좋아요.", scene: "summer beach" },
      { en: "This room is much bigger than that one.", ko: "이 방이 저 방보다 훨씬 커요.", scene: "spacious room" },
      { en: "I'd go with the blue one.", ko: "저는 파란 걸로 할게요.", scene: "blue shirt" },
      { en: "It's way cheaper online.", ko: "온라인이 훨씬 싸요.", scene: "online shopping" },
      { en: "I like this one better.", ko: "저는 이게 더 좋아요.", scene: "choosing between two" },
      { en: "I'm more of a dog person.", ko: "저는 강아지파예요.", native: true, note: "'I prefer dogs'보다 자연스러워요. '~ person'은 '~를 좋아하는 사람'이에요.", scene: "dog in park" },
      { en: "Either works for me.", ko: "둘 다 괜찮아요.", native: true, note: "'Both are okay'보다 원어민다운 대답이에요. 약속 시간이나 장소를 정할 때 특히 많이 써요.", scene: "two options" }
    ],
    dialogue: [
      { s: "A", en: "Do you like living in the city or the countryside?", ko: "도시에 사는 게 좋아요, 시골이 좋아요?" },
      { s: "B", en: "I prefer the city to the countryside.", ko: "저는 시골보다 도시가 좋아요." },
      { s: "A", en: "Why is that?", ko: "왜요?" },
      { s: "B", en: "It's much more convenient. Everything is close.", ko: "훨씬 편리하거든요. 다 가까워요." }
    ],
    writing: {
      prompt: "'책 vs 영화', '여름 vs 겨울' 중 하나를 골라 어느 쪽이 더 좋은지 짧은 단락(3~4문장)으로 써 보세요. 이유를 두 가지 넣어 보세요.",
      hints: ["I prefer A to B.", "First, ~", "Also, ~", "That's why ~"],
      require: ["prefer", "better than", "more .* than", "\\w+er than"],
      minWords: 20,
      samples: ["I prefer books to movies. First, I can imagine the characters and places in my own way. Also, books usually have more details than movies. That's why I always read the book first."]
    }
  },
  {
    id: 16,
    level: 3,
    title: "문제 해결하기",
    pattern: { en: "There's a problem with ~ / ~ isn't working", ko: "~에 문제가 있어요 / ~가 작동을 안 해요" },
    sentences: [
      { en: "There's a problem with my order.", ko: "제 주문에 문제가 있어요.", tip: "불만을 차분하게 시작하는 말.", scene: "delivery box" },
      { en: "The air conditioner isn't working.", ko: "에어컨이 작동을 안 해요.", tip: "기계 고장엔 'isn't working'.", scene: "air conditioner" },
      { en: "Could you send someone to fix it?", ko: "고쳐 줄 사람을 보내 주실 수 있나요?", tip: "해결을 요청하는 말까지 세트로.", scene: "repair technician" },
      { en: "There's a problem with my account.", ko: "제 계정에 문제가 있어요.", scene: "login screen" },
      { en: "The Wi-Fi isn't working.", ko: "와이파이가 작동을 안 해요.", scene: "wifi router" },
      { en: "I got the wrong item.", ko: "제가 잘못된 물건을 받았어요.", scene: "package" },
      { en: "Could you take a look at it?", ko: "한번 봐 주실 수 있나요?", scene: "repair shop" },
      { en: "Can I get a replacement?", ko: "교환해 주실 수 있나요?", scene: "store counter" },
      { en: "My phone just died.", ko: "휴대폰 배터리가 방금 나갔어요.", native: true, note: "기계가 꺼졌을 때 'die'를 써요. 'The battery is finished'는 어색해요.", scene: "dead phone" },
      { en: "It keeps acting up.", ko: "계속 말썽이에요.", native: true, note: "기계나 몸이 제대로 작동하지 않을 때 써요. act up은 말썽을 부리다라는 뜻이에요.", scene: "broken laptop" }
    ],
    dialogue: [
      { s: "A", en: "Front desk. How can I help you?", ko: "프런트입니다. 무엇을 도와드릴까요?" },
      { s: "B", en: "Hi, this is room 512. The air conditioner isn't working.", ko: "안녕하세요, 512호인데요. 에어컨이 안 돼요." },
      { s: "A", en: "I'm sorry about that. We'll send someone right away.", ko: "죄송합니다. 바로 사람을 보내 드릴게요." },
      { s: "B", en: "Thank you. I appreciate it.", ko: "감사합니다." }
    ],
    writing: {
      prompt: "온라인으로 산 물건이 고장 난 채로 왔습니다. 고객센터에 보낼 짧은 메시지(3~4문장)를 써 보세요. 문제 → 상황 → 요청 순서로요.",
      hints: ["There's a problem with ~", "I ordered ~ on ~", "it isn't working", "Could you ~?"],
      require: ["problem", "isn't working", "isn’t working", "doesn't work", "broken"],
      minWords: 20,
      samples: ["Hello, there's a problem with my order. I ordered a hair dryer last Monday, and it arrived yesterday. However, it isn't working at all. Could you send me a new one or give me a refund?"]
    }
  },
  {
    id: 17,
    level: 3,
    title: "약속 잡기",
    pattern: { en: "Are you free ~? / Does ~ work for you?", ko: "~에 시간 돼요? / ~ 괜찮아요?" },
    sentences: [
      { en: "Are you free this Friday?", ko: "이번 금요일에 시간 돼요?", tip: "'free' = 한가한, 시간 되는.", scene: "calendar" },
      { en: "Does 3 p.m. work for you?", ko: "오후 3시 괜찮아요?", tip: "일정 조율에 정말 많이 써요.", scene: "clock meeting time" },
      { en: "Can we push it back an hour?", ko: "한 시간 미룰 수 있을까요?", tip: "'push back' = 미루다.", scene: "rescheduled meeting" },
      { en: "Are you free tomorrow afternoon?", ko: "내일 오후에 시간 돼요?", scene: "afternoon coffee" },
      { en: "Does Monday work for you?", ko: "월요일 괜찮아요?", scene: "weekly planner" },
      { en: "Can we push the meeting back to next week?", ko: "회의를 다음 주로 미룰 수 있을까요?", scene: "postponed meeting" },
      { en: "What time works best for you?", ko: "몇 시가 제일 좋아요?", scene: "schedule" },
      { en: "I'm running ten minutes late.", ko: "10분 정도 늦을 것 같아요.", scene: "hurrying on street" },
      { en: "Can I take a rain check?", ko: "다음으로 미뤄도 될까요?", native: true, note: "약속을 거절하면서 다음을 기약하는 말이에요. 원래 야구 경기 우천 교환권에서 나왔어요.", scene: "rainy day" },
      { en: "Let's play it by ear.", ko: "상황 봐서 정하자.", native: true, note: "악보 없이 귀로 연주하듯, 미리 정하지 말고 그때그때 정하자는 뜻이에요.", scene: "spontaneous trip" }
    ],
    dialogue: [
      { s: "A", en: "Are you free this Friday? Let's catch up.", ko: "이번 금요일에 시간 돼요? 얼굴 좀 봐요." },
      { s: "B", en: "Sure. Does 6 p.m. work for you?", ko: "좋아요. 저녁 6시 괜찮아요?" },
      { s: "A", en: "Can we push it back an hour? I finish work late.", ko: "한 시간 미룰 수 있을까요? 일이 늦게 끝나서요." },
      { s: "B", en: "No problem. See you at seven.", ko: "괜찮아요. 7시에 봐요." }
    ],
    writing: {
      prompt: "오랜만에 친구에게 만나자고 메시지를 써 보세요(3~4문장). 안부 → 제안 → 시간·장소 확인 순서로요.",
      hints: ["It's been a while!", "Are you free ~?", "How about ~?", "Does ~ work for you?"],
      require: ["are you free", "work for you", "how about", "why don't we", "why don’t we"],
      minWords: 20,
      samples: ["Hey, it's been a while! How have you been? Are you free this Saturday? How about having lunch at the Italian place near Gangnam Station? Does noon work for you?"]
    }
  },
  {
    id: 18,
    level: 3,
    title: "감사와 사과",
    pattern: { en: "Thank you for ~ing / I'm sorry for ~ing", ko: "~해 줘서 고마워요 / ~해서 미안해요" },
    sentences: [
      { en: "Thank you for helping me yesterday.", ko: "어제 도와줘서 고마워요.", tip: "for 뒤에 -ing로 구체적인 이유를.", scene: "thank you hug" },
      { en: "I'm sorry for the late reply.", ko: "답장이 늦어서 미안해요.", tip: "이메일 첫 문장 단골.", scene: "email inbox" },
      { en: "I really appreciate it.", ko: "정말 감사해요.", tip: "'Thank you'보다 깊은 고마움.", scene: "grateful smile" },
      { en: "Thank you for waiting.", ko: "기다려 줘서 고마워요.", scene: "waiting patiently" },
      { en: "I'm sorry for being late.", ko: "늦어서 미안해요.", scene: "running late" },
      { en: "Thank you for inviting me.", ko: "초대해 줘서 고마워요.", scene: "invitation card" },
      { en: "Thanks for having me.", ko: "초대해 주셔서 감사해요.", scene: "dinner host" },
      { en: "Sorry to bother you.", ko: "귀찮게 해서 죄송해요.", scene: "interrupting coworker" },
      { en: "I owe you one.", ko: "신세 졌어요.", native: true, note: "도움을 받은 뒤 '다음엔 내가 갚을게'라는 뜻으로 하는 감사 표현이에요.", scene: "helping friend move" },
      { en: "My bad.", ko: "내 실수야.", native: true, note: "가벼운 실수를 인정할 때 써요. 'I'm sorry, it was my mistake'의 짧은 구어예요.", scene: "oops mistake" }
    ],
    dialogue: [
      { s: "A", en: "Thank you for helping me move yesterday.", ko: "어제 이사 도와줘서 고마워요." },
      { s: "B", en: "No problem. It was fun.", ko: "별말씀을요. 재밌었어요." },
      { s: "A", en: "And I'm sorry for keeping you so late.", ko: "그리고 너무 늦게까지 붙잡아서 미안해요." },
      { s: "B", en: "Don't worry about it.", ko: "신경 쓰지 마요." }
    ],
    writing: {
      prompt: "고마운 사람에게 짧은 감사 메시지(3~4문장)를 써 보세요. 무엇이 고마웠는지, 어떤 도움이 됐는지 구체적으로요.",
      hints: ["Thank you for ~ing", "It really helped me ~", "I really appreciate it.", "Let me buy you ~"],
      require: ["thank you for", "thanks for", "appreciate"],
      minWords: 20,
      samples: ["Thank you for helping me with my presentation last week. Your advice really helped me feel more confident. I really appreciate it. Let me buy you a coffee next time!"]
    }
  },
  {
    id: 19,
    level: 3,
    title: "만약 ~라면",
    pattern: { en: "If ~, I'll ~ / If I had ~, I would ~", ko: "~하면 ~할 거예요 / ~라면 ~할 텐데" },
    sentences: [
      { en: "If it rains tomorrow, I'll stay home.", ko: "내일 비 오면 집에 있을 거예요.", tip: "현실 가능성 있는 조건: if + 현재형, will.", scene: "umbrella in rain" },
      { en: "If I had more time, I would learn to cook.", ko: "시간이 더 있으면 요리를 배울 텐데.", tip: "현실과 반대인 상상: if + 과거형, would.", scene: "cooking class" },
      { en: "What would you do if you won the lottery?", ko: "복권에 당첨되면 뭐 할 거예요?", tip: "재미있는 대화 주제로 딱!", scene: "lottery ticket" },
      { en: "If I finish early, I'll call you.", ko: "일찍 끝나면 전화할게요.", scene: "phone call" },
      { en: "If I were a bird, I would fly away.", ko: "제가 새라면 날아갈 텐데.", scene: "bird flying" },
      { en: "If you have time, come over.", ko: "시간 있으면 와요.", scene: "home doorway" },
      { en: "If you need anything, let me know.", ko: "필요한 거 있으면 말해 줘요.", scene: "helping hand" },
      { en: "What would you do if you were me?", ko: "당신이 나라면 어떻게 하겠어요?", scene: "giving advice" },
      { en: "If worst comes to worst, we'll take a taxi.", ko: "최악의 경우엔 택시 타면 돼요.", native: true, note: "'최악의 상황이 되면'이라는 관용구예요.", scene: "taxi at night" },
      { en: "If it were up to me, I'd go.", ko: "내가 정할 수 있다면 가겠어요.", native: true, note: "'be up to someone'은 '~에게 달려 있다'예요. 결정권이 없을 때 의견을 말하는 방법이에요.", scene: "crossroads" }
    ],
    dialogue: [
      { s: "A", en: "What would you do if you won the lottery?", ko: "복권에 당첨되면 뭐 할 거예요?" },
      { s: "B", en: "I would travel around the world for a year.", ko: "1년 동안 세계 여행을 할 거예요." },
      { s: "A", en: "Not bad! I would buy a house by the sea.", ko: "괜찮네요! 저는 바닷가에 집을 살 거예요." },
      { s: "B", en: "If you do, invite me!", ko: "그러면 저 초대해 줘요!" }
    ],
    writing: {
      prompt: "'한 달 동안 휴가가 생긴다면?' 무엇을 할지 짧은 단락(3~4문장)으로 써 보세요.",
      hints: ["If I had a month off, I would ~", "First, ~", "After that, ~", "It would be ~"],
      require: ["if "],
      minWords: 20,
      samples: ["If I had a month off, I would go to Spain. First, I would take a cooking class in Barcelona. After that, I would travel around the country by train. It would be the best month of my life."]
    }
  },
  {
    id: 20,
    level: 3,
    title: "하루를 글로 정리하기",
    pattern: { en: "First, ~ Then, ~ After that, ~ Finally, ~", ko: "먼저 ~ 그다음 ~ 그 후에 ~ 마지막으로 ~" },
    sentences: [
      { en: "First, I had a quick breakfast.", ko: "먼저 아침을 간단히 먹었어요.", tip: "순서를 나타내는 연결어로 글이 정리돼요.", scene: "breakfast" },
      { en: "After that, I had a long meeting.", ko: "그 후에 긴 회의가 있었어요.", tip: "'After that' = 그 후에.", scene: "long meeting" },
      { en: "Overall, it was a productive day.", ko: "전체적으로 보람찬 하루였어요.", tip: "'Overall'로 글을 마무리해요.", scene: "productive desk" },
      { en: "Then, I met my friend.", ko: "그다음 저는 친구를 만났어요.", scene: "meeting friend at cafe" },
      { en: "Finally, I went to bed early.", ko: "마지막으로 저는 일찍 잤어요.", scene: "going to bed" },
      { en: "Overall, it was a good week.", ko: "전체적으로 좋은 한 주였어요.", scene: "weekend" },
      { en: "I got a lot done today.", ko: "오늘 많은 걸 해냈어요.", scene: "checklist done" },
      { en: "Tomorrow is another day.", ko: "내일은 또 다른 날이에요.", scene: "sunrise" },
      { en: "It's been a long day.", ko: "긴 하루였어요.", native: true, note: "피곤한 하루 끝에 원어민이 습관처럼 하는 말이에요.", scene: "evening commute" },
      { en: "I'm calling it a night.", ko: "오늘은 이만 잘게요.", native: true, note: "'I'm going to sleep' 대신 써요. 일을 마무리할 때는 'call it a day'라고 해요.", scene: "bedside lamp" }
    ],
    dialogue: [
      { s: "A", en: "You look happy. How was your day?", ko: "기분 좋아 보이네요. 오늘 어땠어요?" },
      { s: "B", en: "Busy, but good. First, I finished a big report.", ko: "바빴지만 좋았어요. 먼저 큰 보고서를 끝냈어요." },
      { s: "A", en: "Nice. And then?", ko: "좋네요. 그다음엔요?" },
      { s: "B", en: "After that, my team took me out for dinner. Overall, it was a great day.", ko: "그 후에 팀이 저녁을 사 줬어요. 전체적으로 최고의 하루였어요." }
    ],
    writing: {
      prompt: "오늘 하루를 영어 일기로 써 보세요(4~6문장). First / Then / After that / Overall 같은 연결어를 사용하세요.",
      hints: ["First, ~", "Then, ~", "After that, ~", "Overall, it was ~"],
      require: ["first", "then", "after that", "finally", "overall"],
      minWords: 30,
      samples: ["Today was a busy day. First, I woke up late and missed the bus. Then, I had three meetings in a row at work. After that, I went to the gym and felt much better. Finally, I cooked pasta for dinner. Overall, it was tiring but satisfying."]
    }
  }
];

// 커리큘럼을 다 마친 뒤 매일 쓰는 자유 작문 주제
globalThis.FREE_PROMPTS = [
  { prompt: "가장 좋아하는 음식과 그 이유를 소개해 보세요.", hints: ["My favorite food is ~", "because ~", "I usually eat it ~"] },
  { prompt: "최근에 본 영화나 드라마를 친구에게 추천해 보세요.", hints: ["I recently watched ~", "It's about ~", "You should ~"] },
  { prompt: "내 고향(또는 사는 동네)을 외국인 친구에게 소개해 보세요.", hints: ["I live in ~", "It's famous for ~", "If you visit, ~"] },
  { prompt: "올해 꼭 이루고 싶은 목표와 계획을 써 보세요.", hints: ["This year, I'm going to ~", "To do that, I'll ~", "I'm excited about ~"] },
  { prompt: "최근에 실수했던 일과 그 결과를 써 보세요.", hints: ["Last week, I ~", "I ended up ~ing", "Next time, I'll ~"] },
  { prompt: "스트레스를 푸는 나만의 방법을 써 보세요.", hints: ["When I'm stressed, I usually ~", "It helps me ~", "I think ~"] },
  { prompt: "10년 후 나의 모습을 상상해서 써 보세요.", hints: ["In ten years, I'll ~", "I hope ~", "If ~, I would ~"] },
  { prompt: "재택근무 vs 사무실 출근, 어느 쪽이 좋은지 의견을 써 보세요.", hints: ["I prefer A to B", "First, ~", "In my opinion, ~"] },
  { prompt: "가장 기억에 남는 여행을 써 보세요.", hints: ["The best trip I've ever had was ~", "We went to ~", "It was ~"] },
  { prompt: "외국인 동료에게 회식 자리를 제안하는 메시지를 써 보세요.", hints: ["Are you free ~?", "Why don't we ~?", "Does ~ work for you?"] }
];
