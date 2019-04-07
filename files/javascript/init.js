/* ----------------------- */
function create_UUID(){
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}
function setSessionCookie(cname, cvalue) {
  document.cookie = cname + "=" + cvalue + ";" + ";path=/";
}
function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return null;
}
function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

if (null === getCookie("sessionID")){
    setSessionCookie("sessionID", create_UUID())
    console.log("%c Successfully set session cookie ", "color: #4CAF50; background-color: green;")
}
if (null === getCookie("userID")){
    setCookie("userID", create_UUID(), 30)
    console.log("%c Successfully set persistent cookie ", "color: #4CAF50; background-color: green;")
}
/* ----------------------- */
// This is the "Offline copy of pages" service worker

// Add this below content to your HTML page, or add the js file to your page at the very top to register service worker

// Check compatibility for the browser we're running this in

/* ----------------------- */
try {
    if (!(parent && parent.WebPlayer) && top != self) {
      top.location.replace(document.location);
      alert('For security reasons, framing is not allowed; click OK to remove the frames.');
    }
} catch(exception1){
    try {
        document.body.innerHTML = "iframe check failed--webpage contents destroyed"
        document.head.innerHTML = ""
    } catch(exception12){
        window.open("about:blank","_self")
    }
}
/*
if(top!=self){
    top.location.replace(document.location);
    alert("For security reasons, framing is not allowed; click OK to remove the frames.")
}
*/
var deferredPrompt = {"prompt":function(){}}
function installPWA(){
    dialogBox("top-left","notice","Please a few seconds to install the app.")
    deferredPrompt.prompt()
    document.body.removeChild(document.getElementById("installPrompt"))
    navigator.serviceWorker.controller.postMessage({"type":"cachePwa"});
}
window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
  // Update UI notify the user they can add to home screen
  let style = document.createElement("style")
  style.innerHTML = "#installPrompt { position: fixed; bottom: 50px; right: 100px; z-index: 99; color: #333; padding: 8px; font-size: 12px; font-family: \"Open Sans\", \"Helvetica Neue\", Helvetica, Arial, sans-serif; background: #FFF; border: 1px solid #333; border-radius: 5px; line-height: 14px; cursor: pointer; }" // \"Roboto Mono\", monospace
  document.body.appendChild(style)
  let b = document.createElement("a")
  b.onclick = installPWA
  b.id = "installPrompt"
    b.innerHTML = "Install app"
  document.body.appendChild(b)
});
       // This is the "Offline copy of pages" service worker

// Add this below content to your HTML page, or add the js file to your page at the very top to register service worker

// Check compatibility for the browser we're running this in
if ("serviceWorker" in navigator) {
  if (navigator.serviceWorker.controller) {
    console.log("[PWA Builder] active service worker found, no need to register");
  } else {
    // Register the service worker
    navigator.serviceWorker
      .register("service-worker.js", {
        scope: "./"
      })
      .then(function (reg) {
        console.log("[PWA Builder] Service worker has been registered for scope: " + reg.scope);
      });
  }
}
        var getQueryString = function ( field, url = window.location.href ) {
	    var href = url ? url : window.location.href;
	    var reg = new RegExp( '[?&]' + field + '=([^&#]*)', 'i' );
	    var string = reg.exec(href);
	    return string ? string[1] : null;
    };
     if (window.location.pathname === "/pwa" || window.location.pathname === "/pwa.html"){
            document.getElementById("myProfile").style.display = "none"
            document.getElementById("pwaProfile").style.display = ""
		// sessionStorage.setItem("pwa","true")
        }
