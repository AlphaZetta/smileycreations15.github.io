// This is the service worker with the combined offline experience (Offline page + Offline copy of pages)

const CACHE = "pwabuilder-offline-page";

// TODO: replace the following with the correct offline fallback page i.e.: const offlineFallbackPage = "offline.html";
const offlineFallbackPage = "offline.html";
// Not cached pages
const noCache = ["/pwa/windows10/Square71x71Logo.scale-400.png","/pwa/windows10/Square71x71Logo.scale-200.png","/pwa/windows10/Square71x71Logo.scale-100.png","/pwa/windows10/Square71x71Logo.scale-150.png","/pwa/windows10/Square71x71Logo.scale-125.png","/pwa/windows10/Square150x150Logo.scale-400.png","/pwa/windows10/Square150x150Logo.scale-200.png","/pwa/windows10/Square150x150Logo.scale-100.png","/pwa/windows10/Square150x150Logo.scale-150.png","/pwa/windows10/Square150x150Logo.scale-125.png","/pwa/windows10/Wide310x150Logo.scale-400.png","/pwa/windows10/Wide310x150Logo.scale-200.png","/pwa/windows10/Wide310x150Logo.scale-100.png","/pwa/windows10/Wide310x150Logo.scale-150.png","/pwa/windows10/Wide310x150Logo.scale-125.png","/pwa/windows10/Square310x310Logo.scale-400.png","/pwa/windows10/Square310x310Logo.scale-200.png","/pwa/windows10/Square310x310Logo.scale-100.png","/pwa/windows10/Square310x310Logo.scale-150.png","/pwa/windows10/Square310x310Logo.scale-125.png","/pwa/windows10/Square44x44Logo.scale-400.png","/pwa/windows10/Square44x44Logo.scale-200.png","/pwa/windows10/Square44x44Logo.scale-100.png","/pwa/windows10/Square44x44Logo.scale-150.png","/pwa/windows10/Square44x44Logo.scale-125.png","/pwa/windows10/Square44x44Logo.targetsize-256.png","/pwa/windows10/Square44x44Logo.targetsize-48.png","/pwa/windows10/Square44x44Logo.targetsize-24.png","/pwa/windows10/Square44x44Logo.targetsize-16.png","/pwa/windows10/Square44x44Logo.targetsize-256_altform-unplated.png","/pwa/windows10/Square44x44Logo.targetsize-48_altform-unplated.png","/pwa/windows10/Square44x44Logo.targetsize-24_altform-unplated.png","/pwa/windows10/Square44x44Logo.targetsize-16_altform-unplated.png","/pwa/windows10/StoreLogo.scale-400.png","/pwa/windows10/StoreLogo.scale-200.png","/pwa/windows10/StoreLogo.scale-150.png","/pwa/windows10/StoreLogo.scale-125.png","/pwa/windows10/StoreLogo.scale-100.png","/pwa/windows10/StoreLogo.png","/pwa/windows10/SplashScreen.scale-400.png","/pwa/windows10/SplashScreen.scale-200.png","/pwa/windows10/SplashScreen.scale-150.png","/pwa/windows10/SplashScreen.scale-125.png","/pwa/windows10/SplashScreen.scale-100.png","/pwa/windows/windows-smallsquare-24-24.png","/pwa/windows/windows-smallsquare-30-30.png","/pwa/windows/windows-smallsquare-42-42.png","/pwa/windows/windows-smallsquare-54-54.png","/pwa/windows/windows-splashscreen-1116-540.png","/pwa/windows/windows-splashscreen-868-420.png","/pwa/windows/windows-splashscreen-620-300.png","/pwa/windows/windows-squarelogo-270-270.png","/pwa/windows/windows-squarelogo-210-210.png","/pwa/windows/windows-squarelogo-150-150.png","/pwa/windows/windows-squarelogo-120-120.png","/pwa/windows/windows-storelogo-90-90.png","/pwa/windows/windows-storelogo-70-70.png","/pwa/windows/windows-storelogo-50-50.png","/pwa/windows/windowsphone-appicon-106-106.png","/pwa/windows/windowsphone-appicon-62-62.png","/pwa/windows/windowsphone-appicon-44-44.png","/pwa/windows/windowsphone-mediumtile-360-360.png","/pwa/windows/windowsphone-mediumtile-210-210.png","/pwa/windows/windowsphone-mediumtile-150-150.png","/pwa/windows/windowsphone-smalltile-170-170.png","/pwa/windows/windowsphone-smalltile-99-99.png","/pwa/windows/windowsphone-smalltile-71-71.png","/pwa/windows/windowsphone-storelogo-120-120.png","/pwa/windows/windowsphone-storelogo-70-70.png","/pwa/windows/windowsphone-storelogo-50-50.png","/pwa/android/android-launchericon-512-512.png","/pwa/android/android-launchericon-192-192.png","/pwa/android/android-launchericon-144-144.png","/pwa/android/android-launchericon-96-96.png","/pwa/android/android-launchericon-72-72.png","/pwa/android/android-launchericon-48-48.png","/pwa/ios/ios-appicon-1024-1024.png","/pwa/ios/ios-appicon-180-180.png","/pwa/ios/ios-appicon-152-152.png","/pwa/ios/ios-appicon-120-120.png","/pwa/ios/ios-appicon-76-76.png","/pwa/ios/ios-launchimage-750-1334.png","/pwa/ios/ios-launchimage-1334-750.png","/pwa/ios/ios-launchimage-1242-2208.png","/pwa/ios/ios-launchimage-2208-1242.png","/pwa/ios/ios-launchimage-640-960.png","/pwa/ios/ios-launchimage-640-1136.png","/pwa/ios/ios-launchimage-1536-2048.png","/pwa/ios/ios-launchimage-2048-1536.png","/pwa/ios/ios-launchimage-768-1024.png","/pwa/ios/ios-launchimage-1024-768.png","/pwa/chrome/chrome-extensionmanagementpage-48-48.png","/pwa/chrome/chrome-favicon-16-16.png","/pwa/chrome/chrome-installprocess-128-128.png","/pwa/firefox/firefox-marketplace-512-512.png","/pwa/firefox/firefox-marketplace-128-128.png","/pwa/firefox/firefox-general-256-256.png","/pwa/firefox/firefox-general-128-128.png","/pwa/firefox/firefox-general-90-90.png","/pwa/firefox/firefox-general-64-64.png","/pwa/firefox/firefox-general-48-48.png","/pwa/firefox/firefox-general-32-32.png","/pwa/firefox/firefox-general-16-16.png"]

// Install stage sets up the offline page in the cache and opens a new cache
self.addEventListener("install", function (event) {
  console.log("[PWA Builder] Install Event processing");

  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      console.log("[PWA Builder] Cached offline page during install");
      
      if (offlineFallbackPage === "ToDo-replace-this-name.html") {
        return cache.add(new Response("TODO: Update the value of the offlineFallbackPage constant in the serviceworker."));
      }
      
      return cache.add(offlineFallbackPage);
    })
  );
});

// If any fetch fails, it will look for the request in the cache and serve it from there first
self.addEventListener("fetch", function (event) {
  let urlData = new URL(event.request.url)
  if (noCache.includes(urlData.pathname)) return;
  if (event.request.method !== "GET") return;
  event.respondWith(
    fetch(event.request)
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
  return caches.open(CACHE).then(function (cache) {
    return cache.match(request).then(function (matching) {
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
  return caches.open(CACHE).then(function (cache) {
    return cache.put(request, response);
  });
}
// Service Worker Active
self.addEventListener('activate', function(event){
    console.log('Service worker activated');
});
self.addEventListener('message', function(event){
   if (typeof event.data !== "object") return;
  console.log("[service worker] message received.")
  console.log(event.data)
   if (event.data.action === "cachePwa"){
         fetch("/pwa")
      .then(function (response) {
        console.log("[service worker] add page to offline cache by request: " + response.url);

        // If request was success, add or update it in the cache
        updateCache("/pwa", response.clone())

        return response;
      })
   }
     if (event.data.action === "forceCache"){
       try {
        fetch((new URL("event.data.cacheUrl")).pathname)
      .then(function (response) {
        console.log("[service worker] add page to offline cache by request: " + response.url);
        })
        // If request was success, add or update it in the cache
        updateCache((new URL("event.data.cacheUrl")).pathname, response.clone())

        return response;
        } catch(e){
        }
   }
});
