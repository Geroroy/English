// 이등병 (CEFR A1) 콘텐츠: 읽는 법(파닉스) · 발음 · 기초 문법 I · 리딩 A1
// 단원(lesson) 형식: { id, title, ko, intro, sections: [...] }
//   sections[].type: "text" | "examples" | "pairs" | "table" | "quiz"
//   examples: { en, ko, note? } / pairs: { a, b, ko } / table: { head, rows } / quiz: { q, choices, answer(0부터), explain? }
// 리딩 형식: { id, title, cefr, topic, paragraphs, glossary: [{ w, ko }], questions: [quiz 형식] }
// 단어 러쉬 형식: { seconds, words: [{ en, ko }] } (단어 4개 이상)
globalThis.CONTENT = globalThis.CONTENT || {};
globalThis.CONTENT.private = {
  phonics: [
    {
      id: "ph1",
      title: "알파벳이 내는 소리",
      ko: "이름과 소리는 다르다",
      intro: "알파벳 B의 이름은 '비'지만, 단어 안에서 내는 소리는 'ㅂ'에 가깝습니다. 읽기는 글자의 '이름'이 아니라 '소리'를 외우는 데서 시작합니다.",
      sections: [
        {
          type: "table",
          head: ["글자", "소리", "예"],
          rows: [
            ["b", "ㅂ", "bag, big, bus"],
            ["c", "ㅋ (대부분)", "cat, cup, car"],
            ["d", "ㄷ", "dog, dad, desk"],
            ["f", "윗니를 아랫입술에 댄 ㅍ", "fan, fish, fun"],
            ["g", "ㄱ (대부분)", "go, gum, bag"],
            ["h", "ㅎ", "hat, hot, hand"],
            ["j", "ㅈ", "jam, job, jump"],
            ["k", "ㅋ", "kid, kick, key"],
            ["l", "혀끝을 윗잇몸에 댄 ㄹ", "lip, leg, lamp"],
            ["m", "ㅁ", "map, mom, milk"],
            ["n", "ㄴ", "net, nut, nose"],
            ["p", "ㅍ", "pen, pig, pan"],
            ["r", "혀를 아무 데도 안 대는 ㄹ", "red, run, rain"],
            ["s", "ㅅ", "sun, sit, bus"],
            ["t", "ㅌ", "top, ten, cat"],
            ["v", "윗니를 아랫입술에 댄 ㅂ", "van, vet, very"],
            ["w", "입술을 동그랗게 '우'", "wet, win, water"],
            ["y", "'이'에서 시작", "yes, yellow, you"],
            ["z", "소리 나는 ㅅ (벌 소리)", "zoo, zip, zero"]
          ]
        },
        {
          type: "examples",
          title: "소리를 이어 붙여 읽기",
          items: [
            { en: "cat", ko: "ㅋ + ㅐ + ㅌ → 캣 (고양이)" },
            { en: "dog", ko: "ㄷ + ㅏ + ㄱ → 더그 (개)" },
            { en: "sun", ko: "ㅅ + ㅓ + ㄴ → 썬 (해)" },
            { en: "big", ko: "ㅂ + ㅣ + ㄱ → 빅 (큰)" }
          ]
        },
        {
          type: "quiz",
          items: [
            { q: "'fish'의 첫소리는?", choices: ["ㅍ (입술만)", "윗니를 아랫입술에 댄 ㅍ", "ㅎ", "ㅂ"], answer: 1, explain: "f는 윗니를 아랫입술에 살짝 대고 바람을 내보냅니다. 입술만으로 내는 p와 다릅니다." },
            { q: "'zoo'의 z 소리는?", choices: ["ㅈ", "ㅅ", "목이 울리는 ㅅ", "ㅊ"], answer: 2, explain: "z는 s와 입 모양이 같지만 목이 울립니다. 손을 목에 대 보세요." },
            { q: "'red'와 'led'의 첫소리 차이는?", choices: ["없다", "r은 혀를 잇몸에 대지 않는다", "l은 혀를 아무 데도 대지 않는다", "r은 입을 다문다"], answer: 1, explain: "l은 혀끝을 윗잇몸에 붙이고, r은 혀를 어디에도 대지 않은 채 뒤로 말아 올립니다." }
          ]
        }
      ]
    },
    {
      id: "ph2",
      title: "짧은 모음 5개",
      ko: "a · e · i · o · u",
      intro: "자음 사이에 모음이 하나만 있고 끝이 자음으로 끝나면(cat, pen, sit) 모음은 '짧은 소리'로 읽습니다. 가장 많이 나오는 규칙입니다.",
      sections: [
        {
          type: "table",
          head: ["모음", "짧은 소리", "예"],
          rows: [
            ["a", "ㅐ (입을 크게)", "cat, map, hand"],
            ["e", "ㅔ", "pen, bed, red"],
            ["i", "ㅣ (짧게)", "sit, big, fish"],
            ["o", "ㅏ (입을 둥글게)", "hot, dog, box"],
            ["u", "ㅓ", "cup, sun, bus"]
          ]
        },
        {
          type: "examples",
          items: [
            { en: "The cat sat on the mat.", ko: "고양이가 매트 위에 앉았다. (a 세 번 모두 ㅐ)" },
            { en: "Ten red pens.", ko: "빨간 펜 열 자루. (e 세 번 모두 ㅔ)" },
            { en: "A big fish.", ko: "큰 물고기." },
            { en: "A hot dog in a box.", ko: "상자 안의 핫도그." },
            { en: "The bus is up.", ko: "버스가 위에 있다." }
          ]
        },
        {
          type: "quiz",
          items: [
            { q: "'cup'의 u는 어떤 소리?", choices: ["우", "ㅓ", "유", "ㅗ"], answer: 1, explain: "짧은 u는 '우'가 아니라 '어'에 가깝습니다. cup = 컵." },
            { q: "'hot'의 o는?", choices: ["오", "ㅏ (입 둥글게)", "우", "어"], answer: 1, explain: "미국식에서 짧은 o는 입을 둥글게 벌린 '아'. hot = 핫." },
            { q: "짧은 모음 규칙이 적용되는 단어는?", choices: ["cake", "sit", "tree", "boat"], answer: 1, explain: "sit은 자음-모음-자음 구조라 i가 짧게 '이'. 나머지는 긴 모음입니다." }
          ]
        }
      ]
    },
    {
      id: "ph3",
      title: "마법의 e",
      ko: "끝의 e는 앞 모음을 길게 만든다",
      intro: "단어 끝에 e가 붙으면 그 e는 소리가 없고, 대신 앞의 모음이 '알파벳 이름' 그대로 소리 납니다. cap(캡) → cape(케이프).",
      sections: [
        {
          type: "pairs",
          title: "e가 있을 때와 없을 때",
          items: [
            { a: "cap", b: "cape", ko: "모자 / 망토" },
            { a: "kit", b: "kite", ko: "도구 세트 / 연" },
            { a: "hop", b: "hope", ko: "깡충 뛰다 / 희망" },
            { a: "cub", b: "cube", ko: "새끼 곰 / 정육면체" },
            { a: "pet", b: "Pete", ko: "반려동물 / 피트(이름)" },
            { a: "not", b: "note", ko: "아니다 / 메모" }
          ]
        },
        {
          type: "examples",
          items: [
            { en: "I like this cake.", ko: "나는 이 케이크를 좋아해. (like, cake 모두 마법의 e)" },
            { en: "Take a bike ride.", ko: "자전거를 타러 가자." },
            { en: "Time to go home.", ko: "집에 갈 시간이야." }
          ]
        },
        {
          type: "quiz",
          items: [
            { q: "'hope'를 읽으면?", choices: ["홉", "호프", "홉프", "후프"], answer: 1, explain: "끝의 e 때문에 o가 '오우'로 길어집니다." },
            { q: "마법의 e가 적용되지 않는 단어는?", choices: ["name", "bite", "have", "cute"], answer: 2, explain: "have는 예외입니다. '헤이브'가 아니라 '해브'로 읽습니다. 자주 쓰는 단어엔 예외가 있어요." },
            { q: "'kit'에 e를 붙이면 뜻은?", choices: ["연(kite)", "고양이", "부엌", "열쇠"], answer: 0, explain: "kit(도구 세트) → kite(연). 소리도 '킷'에서 '카이트'로 바뀝니다." }
          ]
        }
      ]
    },
    {
      id: "ph4",
      title: "두 글자 한 소리",
      ko: "sh · ch · th · ph · wh",
      intro: "글자 두 개가 붙어서 새로운 소리 하나를 만드는 경우입니다. 따로 읽으면 안 됩니다.",
      sections: [
        {
          type: "table",
          head: ["글자", "소리", "예"],
          rows: [
            ["sh", "쉬 (조용히 할 때)", "ship, shop, fish"],
            ["ch", "취", "chair, lunch, much"],
            ["th", "혀를 이 사이에 넣은 ㅆ", "think, bath, three"],
            ["th", "혀를 이 사이에 넣은 ㄷ (울림)", "this, that, mother"],
            ["ph", "f와 같은 소리", "phone, photo"],
            ["wh", "w와 같은 소리", "what, when, white"],
            ["ck", "ㅋ (k 하나)", "back, clock, duck"],
            ["ng", "ㅇ 받침", "sing, long, ring"]
          ]
        },
        {
          type: "examples",
          items: [
            { en: "She sells fish and chips.", ko: "그녀는 피시 앤 칩스를 판다." },
            { en: "Thank you for the photo.", ko: "사진 고마워요." },
            { en: "What time is lunch?", ko: "점심이 몇 시예요?" },
            { en: "This is my mother.", ko: "이분은 우리 어머니예요. (울리는 th)" }
          ]
        },
        {
          type: "quiz",
          items: [
            { q: "'phone'의 첫소리는?", choices: ["ㅍ", "f 소리", "ㅂ", "ㅎ"], answer: 1, explain: "ph는 항상 f 소리입니다. phone = 포운." },
            { q: "'think'의 th와 'this'의 th 차이는?", choices: ["같다", "think는 안 울리고 this는 울린다", "this는 ㅅ 소리", "think는 ㄷ 소리"], answer: 1, explain: "둘 다 혀를 이 사이에 넣지만 this, that, the 같은 단어는 목이 울립니다." },
            { q: "'ship'과 'chip'의 차이는?", choices: ["없다", "ship은 '쉽', chip은 '칩'", "ship은 '칩', chip은 '쉽'", "둘 다 '십'"], answer: 1, explain: "sh는 '쉬', ch는 '취'. 배(ship)와 감자칩(chip)이 됩니다." }
          ]
        }
      ]
    },
    {
      id: "ph5",
      title: "모음 두 개가 붙으면",
      ko: "ai · ee · oa · ea · oo",
      intro: "모음 두 개가 나란히 오면 보통 앞 모음의 '이름 소리'가 납니다. '첫 번째가 말하고 두 번째는 조용히'라고 외우세요. oo는 예외로 '우' 소리입니다.",
      sections: [
        {
          type: "table",
          head: ["글자", "소리", "예"],
          rows: [
            ["ai / ay", "에이", "rain, wait, day, play"],
            ["ee / ea", "이-", "see, tree, eat, tea"],
            ["oa / ow", "오우", "boat, road, slow, know"],
            ["oo (길게)", "우-", "food, moon, school"],
            ["oo (짧게)", "우 (짧게)", "book, good, look"],
            ["ou / ow", "아우", "house, out, now, cow"]
          ]
        },
        {
          type: "examples",
          items: [
            { en: "Wait for the rain to stop.", ko: "비가 그치기를 기다려." },
            { en: "I see a tree by the sea.", ko: "바다 옆에 나무 한 그루가 보여." },
            { en: "The boat is slow.", ko: "그 배는 느리다." },
            { en: "Look at the moon.", ko: "달을 봐. (look은 짧게, moon은 길게)" }
          ]
        },
        {
          type: "quiz",
          items: [
            { q: "'boat'를 읽으면?", choices: ["보앗", "보우트", "바트", "부트"], answer: 1, explain: "oa는 '오우'. 앞의 o가 이름 소리로 나고 a는 조용히." },
            { q: "'eat'와 'tea'의 공통 소리는?", choices: ["에아", "이-", "에이", "아이"], answer: 1, explain: "ea는 대부분 길게 '이-'. (bread, head처럼 '에'인 예외도 있습니다.)" },
            { q: "'now'의 ow는?", choices: ["오우", "아우", "우", "오"], answer: 1, explain: "ow는 '오우'(slow)와 '아우'(now) 두 가지. 자주 쓰는 단어로 외워 두세요." }
          ]
        }
      ]
    },
    {
      id: "ph6",
      title: "소리 나지 않는 글자와 r 모음",
      ko: "kn · wr · mb · ar · er · or",
      intro: "쓰여 있지만 읽지 않는 글자가 있습니다. 그리고 모음 뒤에 r이 오면 모음 소리가 바뀝니다. 이 두 가지만 알면 처음 보는 단어 대부분을 읽을 수 있습니다.",
      sections: [
        {
          type: "table",
          head: ["글자", "읽는 법", "예"],
          rows: [
            ["kn", "k 안 읽음 → n", "know, knee, knife"],
            ["wr", "w 안 읽음 → r", "write, wrong, wrist"],
            ["mb (끝)", "b 안 읽음 → m", "climb, comb, lamb"],
            ["gh", "안 읽거나 f", "night, light / laugh, enough"],
            ["ar", "아-ㄹ", "car, park, star"],
            ["or", "오-ㄹ", "for, short, morning"],
            ["er / ir / ur", "어-ㄹ (모두 같은 소리)", "her, bird, turn"]
          ]
        },
        {
          type: "examples",
          items: [
            { en: "I know how to write.", ko: "나는 쓸 줄 안다. (k, w 묵음)" },
            { en: "Climb up the hill at night.", ko: "밤에 언덕을 올라가. (b, gh 묵음)" },
            { en: "Her car is in the park.", ko: "그녀의 차는 공원에 있다." },
            { en: "The bird turns left.", ko: "새가 왼쪽으로 돈다. (ir, ur 같은 소리)" }
          ]
        },
        {
          type: "quiz",
          items: [
            { q: "'knife'의 첫소리는?", choices: ["ㅋ", "ㄴ", "ㅋㄴ", "ㅎ"], answer: 1, explain: "kn의 k는 읽지 않습니다. 나이프." },
            { q: "'bird', 'her', 'turn'의 모음 소리는?", choices: ["모두 다르다", "모두 '어-ㄹ'", "이, 에, 우", "모두 '아-ㄹ'"], answer: 1, explain: "ir, er, ur은 철자만 다르고 소리는 모두 같습니다." },
            { q: "'night'를 읽으면?", choices: ["니그트", "나이트", "니트", "나이그트"], answer: 1, explain: "igh는 '아이'로 읽고 gh는 소리가 없습니다." }
          ]
        }
      ]
    }
  ],
  pronunciation: [
    {
      id: "pr1",
      title: "R과 L",
      ko: "혀의 위치가 전부다",
      intro: "한국어 ㄹ은 하나지만 영어는 둘입니다. L은 혀끝을 윗니 뒤 잇몸에 '붙이고', R은 혀를 '아무 데도 대지 않고' 뒤로 살짝 말아 올립니다. 마이크 버튼으로 녹음해 비교해 보세요.",
      sections: [
        {
          type: "pairs",
          title: "최소 대립쌍 (한 소리만 다른 단어)",
          items: [
            { a: "right", b: "light", ko: "오른쪽 / 빛" },
            { a: "rice", b: "lice", ko: "쌀 / 이(벌레)" },
            { a: "road", b: "load", ko: "길 / 짐" },
            { a: "pray", b: "play", ko: "기도하다 / 놀다" },
            { a: "correct", b: "collect", ko: "맞는 / 모으다" },
            { a: "fry", b: "fly", ko: "튀기다 / 날다" }
          ]
        },
        {
          type: "examples",
          items: [
            { en: "Turn right at the light.", ko: "신호등에서 우회전하세요." },
            { en: "I really like fried rice.", ko: "나는 볶음밥을 정말 좋아해." },
            { en: "Larry drove along the river road.", ko: "래리는 강변 도로를 따라 운전했다." }
          ]
        },
        {
          type: "quiz",
          items: [
            { q: "L 소리를 낼 때 혀는?", choices: ["아무 데도 안 댄다", "윗니 뒤 잇몸에 붙인다", "아랫니에 댄다", "입천장 깊숙이"], answer: 1, explain: "L은 혀끝을 윗잇몸에 확실히 붙였다가 뗍니다." },
            { q: "'rice'를 L로 잘못 발음하면 무슨 뜻이 되나요?", choices: ["얼음", "이(벌레)", "쌀", "빛"], answer: 1, explain: "lice는 머릿니. 식당에서 조심해야 할 발음입니다." }
          ]
        }
      ]
    },
    {
      id: "pr2",
      title: "F·V와 P·B",
      ko: "윗니를 아랫입술에",
      intro: "F와 V는 윗니를 아랫입술에 살짝 대고 바람을 내보냅니다. P와 B는 입술 두 개를 붙였다 뗍니다. 한국어에는 F, V가 없어서 ㅍ, ㅂ으로 바뀌기 쉽습니다.",
      sections: [
        {
          type: "pairs",
          items: [
            { a: "fan", b: "pan", ko: "선풍기 / 프라이팬" },
            { a: "coffee", b: "copy", ko: "커피 / 복사" },
            { a: "very", b: "berry", ko: "매우 / 베리" },
            { a: "vest", b: "best", ko: "조끼 / 최고의" },
            { a: "fine", b: "pine", ko: "괜찮은 / 소나무" },
            { a: "leaf", b: "leap", ko: "잎 / 뛰다" }
          ]
        },
        {
          type: "examples",
          items: [
            { en: "I'd like a cup of coffee, please.", ko: "커피 한 잔 주세요." },
            { en: "Five very fresh fish.", ko: "아주 신선한 생선 다섯 마리." },
            { en: "Have you ever been to Vietnam?", ko: "베트남에 가 본 적 있어요?" }
          ]
        },
        {
          type: "quiz",
          items: [
            { q: "F 소리를 낼 때 입은?", choices: ["입술 두 개를 붙인다", "윗니를 아랫입술에 댄다", "입을 다문다", "혀를 내민다"], answer: 1, explain: "거울을 보고 윗니가 아랫입술에 닿는지 확인하세요." },
            { q: "'coffee'를 ㅍ으로 발음하면 들리는 단어는?", choices: ["copy", "cough", "coffin", "cup"], answer: 0, explain: "커'피'라고 하면 copy(복사)로 들릴 수 있습니다." }
          ]
        }
      ]
    },
    {
      id: "pr3",
      title: "TH 두 가지",
      ko: "혀를 이 사이에",
      intro: "TH는 혀끝을 윗니와 아랫니 사이에 살짝 내밀고 바람을 내보냅니다. think처럼 울리지 않는 것과 this처럼 목이 울리는 것 두 가지가 있습니다. ㅆ, ㄷ으로 대신하면 다른 단어가 됩니다.",
      sections: [
        {
          type: "pairs",
          items: [
            { a: "think", b: "sink", ko: "생각하다 / 가라앉다" },
            { a: "thank", b: "tank", ko: "감사하다 / 탱크" },
            { a: "three", b: "tree", ko: "셋 / 나무" },
            { a: "bath", b: "bass", ko: "목욕 / 베이스" },
            { a: "they", b: "day", ko: "그들 / 날" },
            { a: "there", b: "dare", ko: "거기 / 감히 ~하다" }
          ]
        },
        {
          type: "examples",
          items: [
            { en: "I think there are three of them.", ko: "그것들이 세 개 있는 것 같아." },
            { en: "Thank you for this.", ko: "이것 고마워요." },
            { en: "My brother and mother are both thirty.", ko: "형과 어머니 둘 다 서른 살이다." }
          ]
        },
        {
          type: "quiz",
          items: [
            { q: "'three'를 '트리'로 발음하면?", choices: ["숫자 3", "나무(tree)", "자유", "셋 다"], answer: 1, explain: "혀를 이 사이에 넣지 않으면 tree(나무)로 들립니다." },
            { q: "목이 울리는 TH가 들어간 단어는?", choices: ["think", "thank", "this", "three"], answer: 2, explain: "this, that, the, they, mother처럼 자주 쓰는 단어가 울리는 TH입니다." }
          ]
        }
      ]
    },
    {
      id: "pr4",
      title: "Z와 J, S와 SH",
      ko: "울림과 입 모양",
      intro: "Z는 S와 입 모양이 같지만 목이 울립니다(벌 소리 zzz). J는 '쥐'에 가깝고 Z는 '즈'입니다. 한국어 ㅈ으로 둘을 합치면 zoo가 '주'가 되어 Jew로 들립니다.",
      sections: [
        {
          type: "pairs",
          items: [
            { a: "zoo", b: "Sue", ko: "동물원 / 수(이름)" },
            { a: "zip", b: "sip", ko: "지퍼 / 홀짝이다" },
            { a: "zone", b: "Joan", ko: "구역 / 조앤(이름)" },
            { a: "see", b: "she", ko: "보다 / 그녀" },
            { a: "sea", b: "she", ko: "바다 / 그녀" },
            { a: "price", b: "prize", ko: "가격 / 상" }
          ]
        },
        {
          type: "examples",
          items: [
            { en: "Is it easy? Yes, it is.", ko: "쉬워요? 네, 쉬워요. (is, easy의 s는 z 소리)" },
            { en: "She sees the zebra at the zoo.", ko: "그녀는 동물원에서 얼룩말을 본다." },
            { en: "These shoes are size six.", ko: "이 신발은 6 사이즈예요." }
          ]
        },
        {
          type: "quiz",
          items: [
            { q: "'is'의 s 소리는?", choices: ["ㅅ", "z (울림)", "ㅈ", "ㅆ"], answer: 1, explain: "is, his, has, was, easy의 s는 모두 z 소리입니다." },
            { q: "'zoo'를 ㅈ으로 발음하면?", choices: ["동물원", "Jew(유대인)로 들림", "Sue로 들림", "문제 없음"], answer: 1, explain: "Z는 혀끝을 윗니 뒤에 가까이 두고 '즈-'. 입술을 내밀지 마세요." }
          ]
        }
      ]
    },
    {
      id: "pr5",
      title: "강세와 리듬",
      ko: "센 곳은 길고 크게, 나머지는 짧게",
      intro: "영어는 모든 음절을 같은 길이로 읽지 않습니다. 강세 있는 음절은 길고 높게, 나머지는 거의 뭉개듯 짧게 읽습니다. 강세 위치가 틀리면 원어민이 못 알아듣습니다.",
      sections: [
        {
          type: "table",
          head: ["단어", "강세 (대문자)", "흔한 실수"],
          rows: [
            ["banana", "ba-NA-na", "BA-na-na"],
            ["hotel", "ho-TEL", "HO-tel"],
            ["coffee", "COF-fee", "cof-FEE"],
            ["computer", "com-PU-ter", "COM-pu-ter"],
            ["important", "im-POR-tant", "IM-por-tant"],
            ["understand", "un-der-STAND", "UN-der-stand"]
          ]
        },
        {
          type: "pairs",
          title: "강세로 뜻이 바뀌는 단어",
          items: [
            { a: "REcord", b: "reCORD", ko: "기록(명사) / 녹음하다(동사)" },
            { a: "PREsent", b: "preSENT", ko: "선물 / 발표하다" },
            { a: "DEsert", b: "desSERT", ko: "사막 / 디저트" }
          ]
        },
        {
          type: "examples",
          items: [
            { en: "I want a banana and a coffee.", ko: "바나나 하나랑 커피 한 잔 주세요. (ba-NA-na, COF-fee)" },
            { en: "The hotel is very important to me.", ko: "그 호텔은 나에게 아주 중요해." }
          ]
        },
        {
          type: "quiz",
          items: [
            { q: "'hotel'의 강세는?", choices: ["HO-tel", "ho-TEL", "둘 다", "강세 없음"], answer: 1, explain: "뒤에 강세. 한국어식 '호텔'과 달리 '호-텔!'" },
            { q: "'dessert'(디저트)의 강세는?", choices: ["앞 (DEsert)", "뒤 (desSERT)", "없음", "둘 다"], answer: 1, explain: "앞에 강세를 주면 desert(사막)가 됩니다." }
          ]
        }
      ]
    },
    {
      id: "pr6",
      title: "연음: 붙여 읽기",
      ko: "자음 + 모음은 이어진다",
      intro: "앞 단어가 자음으로 끝나고 뒤 단어가 모음으로 시작하면 붙여 읽습니다. 'an apple'은 '어 내플'처럼 들립니다. 듣기가 안 되는 가장 큰 이유가 이것입니다.",
      sections: [
        {
          type: "examples",
          items: [
            { en: "an apple", ko: "어내플 (an + apple)" },
            { en: "turn it off", ko: "터니로프 (turn-it-off)" },
            { en: "pick it up", ko: "피키럽 (pick-it-up)" },
            { en: "Come on in.", ko: "커머닌 (come-on-in)" },
            { en: "What time is it?", ko: "왓 타이미짓? (time-is-it)" },
            { en: "I'll check it out.", ko: "아일 체키라웃 (check-it-out)" }
          ]
        },
        { type: "text", body: "t가 모음 사이에 오면 미국식에서는 부드러운 ㄹ처럼 바뀝니다(water → 워러, better → 베러, 'it is' → 이리즈). 이것을 알면 영화 대사가 갑자기 들리기 시작합니다." },
        {
          type: "quiz",
          items: [
            { q: "'pick it up'은 실제로 어떻게 들리나요?", choices: ["픽 잇 업", "피키럽", "픽키트업", "피킷업"], answer: 1, explain: "pick-it-up이 하나로 붙고, t는 모음 사이라 ㄹ처럼 됩니다." },
            { q: "연음이 일어나는 조합은?", choices: ["자음 + 자음", "자음 + 모음", "모음 + 모음", "모두 아님"], answer: 1, explain: "앞 단어 끝 자음과 뒤 단어 첫 모음이 붙습니다." }
          ]
        }
      ]
    }
  ],
  grammar: [
    {
      id: "gr1",
      title: "be동사: am · is · are",
      ko: "'~이다 / ~에 있다'",
      intro: "영어 문장의 절반은 be동사로 만듭니다. 주어에 따라 am, is, are 셋 중 하나를 고릅니다. 부정은 뒤에 not, 질문은 be동사를 맨 앞으로.",
      sections: [
        {
          type: "table",
          head: ["주어", "be동사", "예"],
          rows: [
            ["I", "am", "I am a student."],
            ["You / We / They", "are", "You are kind. They are here."],
            ["He / She / It", "is", "She is my friend. It is cold."]
          ]
        },
        {
          type: "examples",
          items: [
            { en: "I am hungry.", ko: "나 배고파." },
            { en: "She is not here.", ko: "그녀는 여기 없어. (She isn't here.)" },
            { en: "Are you ready?", ko: "준비됐어? — Yes, I am. / No, I'm not." },
            { en: "Is it far?", ko: "멀어요? — No, it isn't." },
            { en: "We're late.", ko: "우리 늦었어. (We are = We're)" }
          ]
        },
        {
          type: "quiz",
          items: [
            { q: "They ___ my parents.", choices: ["am", "is", "are", "be"], answer: 2, explain: "they → are." },
            { q: "'그는 피곤하지 않아'는?", choices: ["He not tired.", "He is not tired.", "He don't tired.", "He are not tired."], answer: 1, explain: "be동사 + not. 형용사 앞에는 반드시 be동사가 있어야 합니다." },
            { q: "'너 학생이야?'는?", choices: ["You are a student?", "Are you a student?", "Do you a student?", "Is you a student?"], answer: 1, explain: "be동사를 맨 앞으로 보내면 질문이 됩니다." }
          ]
        }
      ]
    },
    {
      id: "gr2",
      title: "일반동사와 do / does",
      ko: "행동을 말하는 문장",
      intro: "like, go, eat 같은 일반동사는 주어가 he/she/it일 때 끝에 -s가 붙습니다. 부정과 질문에는 do/does가 등장하고, 그때 동사는 원래 모양으로 돌아갑니다.",
      sections: [
        {
          type: "table",
          head: ["", "긍정", "부정", "질문"],
          rows: [
            ["I / You / We / They", "I like coffee.", "I don't like coffee.", "Do you like coffee?"],
            ["He / She / It", "She likes coffee.", "She doesn't like coffee.", "Does she like coffee?"]
          ]
        },
        {
          type: "examples",
          items: [
            { en: "I work at a bank.", ko: "나는 은행에서 일해." },
            { en: "He works at a bank.", ko: "그는 은행에서 일해. (-s)" },
            { en: "She doesn't eat meat.", ko: "그녀는 고기를 안 먹어. (doesn't + eat, eats 아님)" },
            { en: "Do you speak English?", ko: "영어 하세요?" },
            { en: "What does he do?", ko: "그는 무슨 일을 해?" }
          ]
        },
        {
          type: "quiz",
          items: [
            { q: "My sister ___ in Seoul.", choices: ["live", "lives", "is live", "living"], answer: 1, explain: "she → lives." },
            { q: "'그는 TV를 안 봐'는?", choices: ["He doesn't watches TV.", "He don't watch TV.", "He doesn't watch TV.", "He not watch TV."], answer: 2, explain: "doesn't 뒤에는 동사 원형." },
            { q: "'너 커피 마셔?'는?", choices: ["Do you drink coffee?", "Are you drink coffee?", "You drink coffee?", "Does you drink coffee?"], answer: 0, explain: "일반동사 질문은 Do/Does로 시작." }
          ]
        }
      ]
    },
    {
      id: "gr3",
      title: "a · an · the",
      ko: "관사: 하나인지, 아는 것인지",
      intro: "셀 수 있는 명사 하나를 처음 말할 때 a/an, 서로 아는 것을 말할 때 the. 한국어에 없는 개념이라 가장 많이 빠뜨리는 부분입니다.",
      sections: [
        {
          type: "examples",
          items: [
            { en: "I have a dog. The dog is small.", ko: "나는 개가 한 마리 있어. 그 개는 작아. (처음엔 a, 두 번째부터 the)" },
            { en: "an apple, an hour, an umbrella", ko: "모음 '소리'로 시작하면 an (hour의 h는 소리가 없음)" },
            { en: "a university, a European", ko: "글자는 모음이지만 소리가 '유'라서 a" },
            { en: "Close the door.", ko: "(우리 둘 다 아는 그) 문 닫아." },
            { en: "I like music.", ko: "나는 음악을 좋아해. (셀 수 없는 명사엔 관사 없음)" }
          ]
        },
        {
          type: "quiz",
          items: [
            { q: "I need ___ umbrella.", choices: ["a", "an", "the", "없음"], answer: 1, explain: "umbrella는 모음 소리로 시작 → an." },
            { q: "She is ___ teacher.", choices: ["a", "an", "the", "없음"], answer: 0, explain: "직업을 말할 때는 a/an을 붙입니다." },
            { q: "Can you pass me ___ salt?", choices: ["a", "an", "the", "없음"], answer: 2, explain: "식탁 위에 있는 '그' 소금 → the." }
          ]
        }
      ]
    },
    {
      id: "gr4",
      title: "복수형과 There is / are",
      ko: "여러 개 말하기, 있다고 말하기",
      intro: "둘 이상이면 명사 끝에 -s. '~이 있다'는 There is(하나) / There are(여럿)로 시작합니다.",
      sections: [
        {
          type: "table",
          head: ["규칙", "예"],
          rows: [
            ["대부분 -s", "book → books, car → cars"],
            ["-s, -sh, -ch, -x 뒤 -es", "bus → buses, dish → dishes, box → boxes"],
            ["자음 + y → -ies", "city → cities, baby → babies"],
            ["불규칙", "man → men, child → children, foot → feet, person → people"]
          ]
        },
        {
          type: "examples",
          items: [
            { en: "There is a cat on the sofa.", ko: "소파 위에 고양이 한 마리가 있어." },
            { en: "There are two cats on the sofa.", ko: "소파 위에 고양이 두 마리가 있어." },
            { en: "Is there a bank near here?", ko: "이 근처에 은행 있어요?" },
            { en: "There aren't any children here.", ko: "여기엔 아이들이 없어요." }
          ]
        },
        {
          type: "quiz",
          items: [
            { q: "'child'의 복수형은?", choices: ["childs", "childes", "children", "childrens"], answer: 2, explain: "불규칙 복수. children 자체가 이미 복수라 -s를 또 붙이지 않습니다." },
            { q: "There ___ three people in the room.", choices: ["is", "are", "be", "have"], answer: 1, explain: "people(여럿) → are." },
            { q: "'city'의 복수형은?", choices: ["citys", "cities", "cityes", "citi"], answer: 1, explain: "자음 + y는 y를 i로 바꾸고 -es." }
          ]
        }
      ]
    }
  ],
  reading: [
    {
      id: "rd1",
      title: "My Morning",
      cefr: "A1",
      topic: "일상",
      paragraphs: ["My name is Mina. I get up at seven. I wash my face and eat breakfast. I like toast and milk.", "At eight, I go to work. I take the bus. The bus is big and green. My office is near the park.", "I work from nine to six. At lunch, I eat with my friend Tom. He is from Canada. We talk about movies."],
      glossary: [
        { w: "get up", ko: "일어나다" },
        { w: "breakfast", ko: "아침 식사" },
        { w: "take the bus", ko: "버스를 타다" },
        { w: "near", ko: "~ 근처에" },
        { w: "talk about", ko: "~에 대해 이야기하다" }
      ],
      questions: [
        { q: "What time does Mina get up?", choices: ["At six", "At seven", "At eight", "At nine"], answer: 1 },
        { q: "How does she go to work?", choices: ["By car", "By bike", "By bus", "On foot"], answer: 2 },
        { q: "Where is Tom from?", choices: ["Korea", "Canada", "England", "The park"], answer: 1 }
      ]
    },
    {
      id: "rd2",
      title: "A Small Café",
      cefr: "A1–A2",
      topic: "장소",
      paragraphs: ["There is a small café on my street. It opens at eight in the morning and closes at ten at night. The owner is an old man named Mr. Park. He always smiles.", "The café has five tables and many books. People read, drink coffee, and talk quietly. The coffee is not expensive. A cup is three thousand won.", "On Sundays, Mr. Park plays old music. I go there with my laptop and work for two hours. It is my favorite place in the city."],
      glossary: [
        { w: "owner", ko: "주인" },
        { w: "quietly", ko: "조용히" },
        { w: "expensive", ko: "비싼" },
        { w: "favorite", ko: "가장 좋아하는" }
      ],
      questions: [
        { q: "When does the café close?", choices: ["At eight", "At ten in the morning", "At ten at night", "On Sundays"], answer: 2 },
        { q: "How much is a cup of coffee?", choices: ["Free", "Two thousand won", "Three thousand won", "Five thousand won"], answer: 2 },
        { q: "What does Mr. Park do on Sundays?", choices: ["He closes the café", "He plays old music", "He reads books", "He works on a laptop"], answer: 1 }
      ]
    }
  ]
};
