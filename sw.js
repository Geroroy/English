// 오프라인 사용을 위한 서비스 워커: 정적 파일을 캐시하고, 온라인이면 최신 파일로 갱신
const CACHE = "english-camp-v5";
const ASSETS = ["./", "index.html", "styles.css", "js/config.js", "js/content/beginner.js", "js/content/intermediate.js", "js/content/advanced.js", "js/levels.js", "js/lessons.js", "js/scenes.js", "js/audio.js", "js/core.js", "js/app.js", "manifest.webmanifest", "icon.svg"];

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
