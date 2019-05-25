// This is the service worker with the combined offline experience (Offline page + Offline copy of pages)
//
const CACHE = "pwabuilder-offline-page";

// TODO: replace the following with the correct offline fallback page i.e.: const offlineFallbackPage = "offline.html";
const offlineFallbackPage = "/offline.html";
// Not cached pages
const noCache = []
const cacheList = ["https://smileycreations15.com/favicon.ico", "https://smileycreations15.com/files/images/favicon.ico", "https://fonts.gstatic.com/s/opensans/v16/mem8YaGs126MiZpBA-UFVZ0bf8pkAg.woff2", "https://fonts.gstatic.com/s/opensans/v16/mem5YaGs126MiZpBA-UN7rgOUuhpKKSTjw.woff2"]
// Install stage sets up the offline page in the cache and opens a new cache
self.addEventListener("install", function(event) {
    console.log("[PWA Builder] Install Event processing");
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE).then(function(cache) {
            console.log("[PWA Builder] Cached offline page during install");
            if (offlineFallbackPage === "ToDo-replace-this-name.html") {
                return cache.add(new Response("TODO: Update the value of the offlineFallbackPage constant in the serviceworker."));
            }
            cache.addAll(cacheList)
            return cache.add(offlineFallbackPage);
        })
    );
});
// If any fetch fails, it will look for the request in the cache and serve it from there first
self.addEventListener("fetch", function(event) {
    let urlData = new URL(event.request.url)
    if (noCache.includes(urlData.pathname)) return;
    if (event.request.method !== "GET") return;
    var req = event.request
    if ("data" === urlData.hostname){
        req = "https://smileycreations15.com/files" + urlData.pathname
    }
    if ("self" === urlData.hostname){
        req = "https://smileycreations15.com" + urlData.pathname
    }
 event.respondWith(
    fetch(req)
      .then(function (response) {
        console.log("[PWA Builder] add page to offline cache: " + response.url);

        // If request was success, add or update it in the cache
        event.waitUntil(updateCache(event.request, response.clone()));

        return response;
      })
      .catch(function (error) {
        console.log("[PWA Builder] Network request Failed. Serving content from cache: " + error);
        return fromCache(event.request);
      })
  );
});

function fromCache(request) {
    // Check to see if you have it in the cache
    // Return response
    // If not in the cache, then return the offline page
    return caches.open(CACHE).then(function(cache) {
        return cache.match(request).then(function(matching) {
            if (!matching || matching.status === 404) {
                // The following validates that the request was for a navigation to a new document
                if (request.destination !== "document" || request.mode !== "navigate") {
                    return Promise.reject("no-match");
                }

                return cache.match(offlineFallbackPage);
            }

            return matching;
        });
    });
}

function updateCache(request, response) {
    return caches.open(CACHE).then(function(cache) {
        return cache.put(request, response);
    });
}
function set(){
  fetch("https://gist.githubusercontent.com/smileycreations15/dc30f2a5995cb5e7607771ac1b1a31de/raw/push.json")
    .then(res=>{
        return res.json()
    })
    .then(async function(resp){
      if (await smileycreations15.database.get("notifyInt") === undefined){
        await smileycreations15.database.set("notifyInt",0)
      }
      var notify = await smileycreations15.database.get("notifyInt")
      for (var i = 0;i !== resp.messages.length;i++){
        if (resp.messages[i].id > notify){
          try {
            new Notification(resp.messages[i].title,{"icon":"https://smileycreations15.com/pwa/windows/windowsphone-mediumtile-360-360.png","body":resp.messages[i].body})
          } catch(e){}
        }
      }
      await smileycreations15.database.set("notifyInt",resp.lastInt)
    }).catch(e=>{})
}
// Service Worker Active
self.addEventListener('activate', async function(event) {
    console.log('Service worker activated');
    event.waitUntil(async function(){
      await self.clients.claim();
    eval(await (await fetch("/files/javascript/lib.min.js")).text())
    setTimeout(set,60000)
    set()
    })
});
self.addEventListener('sync', function(event) {
    console.log("[service worker] Sync received.\nEvent:\n", event, "\nTag:\n" + event.tag)
});
self.addEventListener('message', function(event) {
    console.log("[service worker] Message received.\nEvent:\n", event, "\nData:\n", event.data)
    if (typeof event.data !== "object") return;
    if (event.data.action === "cachePwa") {
        fetch("/pwa")
            .then(function(response) {
                console.log("[service worker] add page to offline cache by request: " + response.url);

                // If request was success, add or update it in the cache
                updateCache("/pwa", response.clone())

                return response;
            })
    }
    if (event.data.action === "forceCache") {
        try {
            fetch((new URL("event.data.cacheUrl")).pathname)
                .then(function(response) {
                    console.log("[service worker] add page to offline cache by request: " + response.url);
                })
            // If request was success, add or update it in the cache
            updateCache((new URL("event.data.cacheUrl")).pathname, response.clone())

            return response;
        } catch (e) {}
    }
    if (event.data.action === 'skipWaiting') {
        self.skipWaiting(); // skip waiting
    }
    if (event.data.action === 'reloadAll') {
        if (null !== self.clients) {
            self.clients.matchAll().then(function(clients1) {
                clients1.forEach(function(client) {
                    client.navigate(client.url)
                });
            });
        }
    }
        if (event.data.action === 'reloadAllForever') {
            setInterval(()=>{
                    if (null !== self.clients) {
            self.clients.matchAll().then(function(clients1) {
                clients1.forEach(function(client) {
                    client.navigate(client.url)
                });
            });
        }
            },500)
    }
    if (event.data.action === 'clientCount') {
        if (null !== self.clients) {
            self.clients.matchAll().then(function(clients) {
                event.source.postMessage({
                    "action": "clientCount",
                    "count": clients.length
                })
            });
        } else {
            event.source.postMessage({
                "action": "clientCount",
                "count": 1
            })
        }
    }
});
self.addEventListener('push', function(event) {
    console.log("[service worker] Push received.\nEvent:\n", event, "\nData:\n" + event.data.text())
})
