// 오프라인 사용을 위한 서비스 워커: 정적 파일을 캐시하고, 온라인이면 최신 파일로 갱신
// 같은 출처 요청만 다룬다 (카카오 SDK·API·로그인 등 외부 요청은 캐시하지 않고 브라우저에 맡김)
const CACHE = "ten-min-english-v5";
const ASSETS = ["./", "index.html", "styles.css", "js/lessons.js", "js/scenes.js", "js/audio.js", "js/core.js", "js/app.js", "manifest.webmanifest", "icon.svg"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return;
  if (url.searchParams.has("code")) return; // 카카오 로그인 리다이렉트 (일회용 code가 든 주소)는 캐시하지 않음
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
