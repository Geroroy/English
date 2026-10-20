# The Ten Minutes — 하루 10분, 회화에서 영작까지

하루 **10분**, 실생활 영어 문장 10개를 익히고 최종적으로 **스스로 영작**할 수 있도록 설계된 웹 앱(PWA)입니다.
설치나 빌드 없이 브라우저에서 바로 실행되고, 휴대폰 홈 화면에 추가하면 앱처럼 쓸 수 있습니다.

## 하루 10분 학습 흐름

| 단계 | 시간 | 내용 |
|---|---|---|
| 복습 | 1분 | 지난 문장을 간격 반복(1·3·7·14·30·60일)으로 다시 꺼내 말하기 |
| 오늘의 문장 | 4분 | 10문장: 핵심 표현 8개 + **교과서 밖 원어민 표현 2개** (설명 포함) |
| 대화 | 1분 | 문장이 실제로 쓰이는 짧은 상황 대화 (화자별 다른 목소리) |
| 문장 만들기 | 1.5분 | 오늘 문장 3개를 한국어 → 영어 단어 조립으로 |
| 작문 | 2.5분 | 직접 쓰기 → 자가 체크리스트 → 예시 답안과 비교 → 고쳐 쓰기 |

상단 가운데 타임코드가 10분을 세고, 마지막 3분은 점점 붉어지고, 1분 전부터 흔들리며, 10초 전부터 계속 떨립니다.

## 작문 단계 (최종 목표: 자유 작문)

- **Lv.1 한 문장 쓰기** (Day 1–7): 주문, 부탁, 계획, 경험, 제안, 길 묻기
- **Lv.2 2~3문장 연결하기** (Day 8–14): 의견, 이유, 감정, 습관, 허락, 과거 이야기, 조언
- **Lv.3 짧은 단락 쓰기** (Day 15–20): 비교, 문제 해결, 약속 잡기, 감사·사과, 가정, 일기
- **Lv.4 자유 작문**: 20개 레슨을 마치면 매일 새로운 주제로 자유 작문 + 복습

## 음성

모든 문장, 대화, 예시 답안은 **Kokoro-82M 신경망 음성**(Apache-2.0)으로 미리 녹음되어 `audio/`에 들어 있습니다.
녹음이 없는 글(작문노트 등)은 브라우저 음성 중 가장 자연스러운 것으로 읽습니다.
문장을 고치거나 추가했다면 `tools/generate-audio.mjs`로 다시 생성하세요 (사용법은 파일 머리말).

## 사진

문장마다 `scene`(장면 검색어)이 있고, `tools/fetch-photos.mjs`가 Unsplash에서 실사 사진을 받아 `photos/`와 `js/scenes.js`를 채웁니다.
Unsplash 무료 API 키와 네트워크 허용(api.unsplash.com, images.unsplash.com)이 필요합니다. 사진이 없는 문장은 '사진 준비 중' 프레임이 나옵니다.

## 카카오톡 알림

정한 시각마다 오늘의 영어 한 문장(영어 + 한국어 뜻 + "오늘 10분 시작하기" 링크)을 **카카오톡 '나에게 보내기'**로 받을 수 있습니다.
친구에게 보내기는 카카오 비즈니스 심사가 필요해서 쓰지 않습니다. 키는 저장소에 들어 있지 않으니 직접 발급해 넣어야 합니다.

1. **앱 만들기**: [카카오 디벨로퍼스](https://developers.kakao.com) → 내 애플리케이션 → 애플리케이션 추가하기
2. **플랫폼 등록**: 앱 설정 → 플랫폼 → Web → 사이트 도메인에 앱 주소 등록 (예: `http://localhost:8000`, `https://<아이디>.github.io`)
3. **카카오 로그인 켜기**: 제품 설정 → 카카오 로그인 → 활성화 ON, **Redirect URI**에 앱 페이지 주소를 그대로 등록
   (예: `http://localhost:8000/`, `https://<아이디>.github.io/English/` — 끝의 `/`까지 같아야 함)
4. **동의항목**: 카카오 로그인 → 동의항목 → **카카오톡 메시지 전송(talk_message)** 을 '선택 동의'로 설정
5. **키 입력**: 앱 설정 → 앱 키의 **JavaScript 키**와 **REST API 키**를 앱의 기록 탭 → '카톡 알림' 카드 → '카카오 앱 키'에 입력
   (키와 토큰은 그 브라우저의 localStorage에만 저장됩니다) → **카카오 로그인** → '지금 테스트 보내기'로 확인
6. **시간 설정**: 같은 카드에서 켜기 → '매일 정해진 시각'(시각 추가·삭제) 또는 'N분마다'(최소 15분, 시작·끝 시각) → 요일 선택.
   바꾸는 즉시 저장되고, 카드에 "다음 알림: 오늘 21:00 (2시간 13분 후)"처럼 남은 시간이 보입니다.
7. **(선택) 항상 받기**: 브라우저는 **앱이 열려 있을 때만** 보낼 수 있습니다. 앱이 닫혀 있어도 받으려면 PC나 서버에서 전송기를 켜 두세요.

```bash
# 카드의 '일정 내보내기'로 복사한 JSON을 kakao-schedule.json으로 저장한 뒤
export KAKAO_REST_KEY=<REST API 키>
node tools/kakao-timer.mjs --auth                 # 인가 URL 출력 → 로그인 후 돌아온 주소의 code 복사
node tools/kakao-timer.mjs --auth --code <code>   # refresh token 발급
export KAKAO_REFRESH_TOKEN=<refresh token>
export APP_URL=https://<아이디>.github.io/English/ # 메시지 속 링크 (선택)
node tools/kakao-timer.mjs --dry-run --schedule kakao-schedule.json   # 다음 시각만 확인
node tools/kakao-timer.mjs --schedule kakao-schedule.json             # 켜 두기 (또는 --times 08:00,21:30 --days 1-5)
```

전송기는 앱과 같은 `js/core.js`로 일정을 계산합니다. 카카오 로그인에서 Client Secret을 켰다면 `KAKAO_CLIENT_SECRET`도 넣으세요(브라우저 로그인은 Client Secret을 끈 상태에서만 동작합니다).
refresh token은 약 2달 유효하고, 만료가 가까워지면 카카오가 새 토큰을 주며 스크립트가 출력해 알려 줍니다.

## 실행

```bash
python3 -m http.server 8000
# 브라우저에서 http://localhost:8000 접속
```

GitHub Pages 등 아무 정적 호스팅에 그대로 올려도 됩니다. 학습 기록은 브라우저(localStorage)에 저장됩니다.

## 구조

```
index.html               화면 틀
styles.css               스타일 (어두운 상영관 / 아이보리 종이 테마)
js/lessons.js            커리큘럼 (레슨 20개 × 10문장, 원어민 표현 40개) + 자유 작문 주제
js/scenes.js             문장별 장면 사진 목록
js/audio.js              문장별 녹음 파일 목록 (자동 생성)
js/core.js               순수 로직: 연속 학습일, 간격 반복, 문장 만들기 선택, 작문 체크, 카톡 알림 일정
js/app.js                화면과 학습 흐름
audio/                   신경망 음성 MP3
tools/generate-audio.mjs 음성 생성기
tools/fetch-photos.mjs   사진 받기
tools/kakao-timer.mjs    카카오톡 학습 알림 상시 전송기
sw.js                    오프라인 캐시
tests/core.test.mjs      로직·데이터 테스트
docs/design-brief.md     "오늘의 문장" 화면 디자인 브리프
```

## 테스트

```bash
node --test tests/*.test.mjs
```
