# 프롬프트: 카카오톡 학습 알림 타이머

> 이 문서는 "원하는 시간마다 카톡으로 메시지를 보내고, 시간은 사용자가 직접 조절"하는 기능을 구현하기 위해 작성한 작업 지시문입니다.

## 목표

The Ten Minutes(정적 PWA, 빌드 없음, 순수 JS)에 **카카오톡 '나에게 보내기' 학습 알림 타이머**를 추가한다.
사용자가 앱 안에서 보낼 시간을 직접 정하고(추가·삭제·요일·간격), 그 시각이 되면 오늘의 영어 문장이 담긴 카톡 메시지가 본인에게 전송된다.

## 저장소 맥락 (먼저 읽을 것)

- `index.html`, `js/app.js`(UI, IIFE, `h()` DOM 헬퍼, `state`/`save()`/`toast()`/`ask()`), `js/core.js`(UI와 분리된 순수 로직, `globalThis.Core`), `js/lessons.js`, `sw.js`(캐시 목록·버전), `tests/core.test.mjs`(`vm`으로 core.js 로드), `README.md`, `tools/*.mjs`(Node 스크립트 머리말 주석 형식).
- 코드 스타일·주석 밀도·한국어 UI 문구를 기존 코드에 맞춘다. 외부 의존성(npm)은 추가하지 않는다.
- `load()`는 `Object.assign(Core.defaultState(), saved)`라서 기존 사용자의 `settings`에 새 키가 없을 수 있다 → 안전하게 기본값을 병합할 것.

## 요구 사항

### 1. 일정 계산 (순수 로직, `js/core.js`)
- 일정 형식(예시):
  ```js
  kakao: {
    enabled: false,
    mode: "daily",            // "daily" | "interval"
    times: ["08:00", "21:00"], // daily: 하루 중 보낼 시각들 (HH:MM)
    days: [0,1,2,3,4,5,6],     // 보낼 요일 (0=일)
    every: 60,                 // interval: N분마다
    from: "09:00", to: "22:00",// interval: 보내는 시간대
    lastSent: null             // 마지막으로 보낸 예정 시각(ms)
  }
  ```
- `Core.defaultKakao()`, `Core.nextFire(schedule, now: Date) -> Date|null`(다음 전송 시각, 요일·자정 넘김·빈 목록 처리), `Core.dueFire(schedule, now, graceMin=15) -> Date|null`(지금 보내야 할 예정 시각; 이미 보낸 것·너무 오래 놓친 것은 제외), `Core.validTime("HH:MM")`, `Core.kakaoMessage(lesson/문장, url)`(200자 이내 텍스트) 추가 후 export.
- `tests/core.test.mjs`에 위 함수 테스트 추가 (daily 여러 시각, 요일 건너뛰기, 자정 넘김, interval 시간대 경계, 중복 전송 방지, grace 초과).

### 2. 앱 UI (`js/app.js`, `styles.css`)
- **기록 탭 → 설정 카드 아래에 "카톡 알림" 카드** 추가:
  - 켜기/끄기 토글, 모드 선택(매일 정해진 시각 / N분마다)
  - 시각 목록: `<input type="time">`으로 추가·삭제, 요일 칩(일~토) 토글
  - 간격 모드: 분 단위 숫자 입력(최소 15분) + 시작/끝 시각
  - "다음 알림: 오늘 21:00 (2시간 13분 후)" 같은 남은 시간 표시 (1초마다 갱신은 이 카드가 보일 때만)
  - 카카오 연결 상태, "카카오 로그인", "연결 해제", "지금 테스트 보내기"
  - 설정 변경 즉시 `save()`
- 앱이 열려 있는 동안 30초마다(+ `visibilitychange`로 돌아왔을 때) `Core.dueFire`를 확인해 전송, 성공 시 `lastSent` 저장·`toast`. 실패 시 원인을 toast로 알림.
- 메시지 내용: 다음에 배울 레슨(또는 오늘 복습 문장) 한 문장 영어 + 한국어 뜻 + "오늘 10분 시작하기" 링크(현재 앱 주소).
- 브라우저 한계를 카드 안에 짧게 안내: "앱이 열려 있을 때만 보내요. 항상 받으려면 PC/서버에서 `tools/kakao-timer.mjs`를 실행하세요." + 일정을 스크립트용 JSON으로 복사하는 "일정 내보내기" 버튼.

### 3. 카카오 연동 (브라우저)
- 카카오 API '나에게 보내기'(`POST https://kapi.kakao.com/v2/api/talk/memo/default/send`, 동의항목 `talk_message`)만 사용. 친구에게 보내기는 비즈니스 심사가 필요하므로 제외.
- Kakao JS SDK v2는 기능을 쓸 때만 지연 로드(`https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js`, 버전 고정). 키는 저장소에 넣지 않는다 — 사용자가 카드에서 **JavaScript 키, REST API 키**를 입력하면 localStorage에 저장.
- 로그인: `Kakao.Auth.authorize({ redirectUri: 현재 페이지, scope: "talk_message" })` → 돌아오면 `?code=` 를 `https://kauth.kakao.com/oauth/token`(grant_type=authorization_code, client_id=REST 키)으로 교환 → access/refresh 토큰과 만료 시각 저장, URL에서 code 제거.
- 만료되면 refresh_token으로 자동 갱신. 전송은 `Kakao.Auth.setAccessToken` 후 `Kakao.API.request({ url: "/v2/api/talk/memo/default/send", data: { template_object } })`, 텍스트 템플릿.
- 네트워크·키가 없는 환경에서도 앱의 나머지 기능은 그대로 동작해야 한다(오류는 카드 안에서만 표시).

### 4. 항상 켜두는 전송기 (`tools/kakao-timer.mjs`)
- Node 18+ 표준 기능만 사용(`fetch`). 머리말에 준비물·실행법 주석.
- `js/lessons.js`, `js/core.js`를 `vm`으로 불러와 **앱과 같은 `Core.nextFire`/`Core.kakaoMessage`** 사용.
- 환경 변수: `KAKAO_REST_KEY`, `KAKAO_REFRESH_TOKEN`(+선택 `KAKAO_CLIENT_SECRET`, `APP_URL`).
- 옵션: `--schedule 파일.json`(앱에서 내보낸 JSON), 또는 `--times 08:00,21:30 --days 1-5`, `--every 60 --from 09:00 --to 22:00`; `--once`(지금 한 번 보내기), `--dry-run`(보내지 않고 다음 시각만 출력), `--auth`(인가 URL 출력 → `--code`로 refresh token 발급 안내).
- 다음 시각까지 대기 → 전송 → 반복. 새 refresh_token이 오면 출력해 알려준다.

### 5. 마무리
- `sw.js` CACHE 버전 올리기(외부 카카오 요청은 캐시하지 않도록 같은 출처 요청만 캐시).
- `README.md`에 "카카오톡 알림" 섹션: 카카오 디벨로퍼스 앱 만들기 → 플랫폼(Web)에 사이트 도메인 등록 → 카카오 로그인 활성화 + Redirect URI 등록 → 동의항목 '카카오톡 메시지 전송' 설정 → 키 입력 → 시간 설정 → (선택) 스크립트로 상시 전송.
- `node --test tests/*.test.mjs` 통과, `node tools/kakao-timer.mjs --dry-run --times 08:00,21:00` 동작 확인, `node --check`로 모든 JS 문법 확인.
- 완료 후 변경 요약(파일별), 검증 결과, 사용자가 직접 해야 할 일(카카오 키 발급 등)을 보고.
