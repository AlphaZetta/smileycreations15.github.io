function openPwaUrl(url){
  open(url,"","resizable=1,width=" + String(screen.width / 2) + ",height=" + String(screen.height / 2))
}
window.refreshing = false;
window.installUpdatedPwa = function(worker){
  document.getElementById("main-content-body").innerHTML = "<h2>PWA Update in progress...</h2><p id='pwaStatus'>Status: Sending worker message...</p>"
  worker.postMessage({ action: 'skipWaiting' });
    document.getElementById("main-content-body").innerHTML = "<h2>PWA Update in progress...</h2><p id='pwaStatus'>Status: Adding event listener...</p>"
   // The event listener that is fired when the service worker updates
   // Here we reload the page
    navigator.serviceWorker.addEventListener('controllerchange', function () {
      if (window.refreshing) return;
          document.getElementById("main-content-body").innerHTML = "<h2>PWA Update in progress...</h2><p id='pwaStatus'>Status: Done!<br>Reloading page...</p>"
      window.location.reload();
      window.refreshing = true;
    });
      document.getElementById("main-content-body").innerHTML = "<h2>PWA Update in progress...</h2><p id='pwaStatus'>Status: Waiting for worker update...</p>"

}
