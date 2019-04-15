/* ----------------------- */
var savedPath = window.location.pathname
function postSecure(data){
  if (null !== navigator.serviceWorker){
    if (null !== navigator.serviceWorker.controller){
      navigator.serviceWorker.controller.postMessage(data)
    }
  }
}
/*function openURLInNewTab(url){
	open(url,"","resizable=1,width=" + String(screen.width / 2) + ",height=" + String(screen.height / 2))
}
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
*/
/* ----------------------- */
// This is the "Offline copy of pages" service worker

// Add this below content to your HTML page, or add the js file to your page at the very top to register service worker

// Check compatibility for the browser we're running this in

/* ----------------------- */
/*try {
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
}*/
/*
if(top!=self){
    top.location.replace(document.location);
    alert("For security reasons, framing is not allowed; click OK to remove the frames.")
}
*/
var deferredPrompt = {prompt:(()=>{})}
var a1 = false
if (window.matchMedia('(display-mode: standalone)').matches){
	if (window.location.pathname === "/pwa"){
		postSecure({"action":"pwaStatus","status":"pwa-launch"})
	} else {
		postSecure({"action":"pwaStatus","status":"pwa-url-launch","url":window.location.pathname})
	}
}
function installPWA(){
    postSecure({"action":"pwaStatus","status":"pwa-install-prompt"});
    // history.replaceState({},"smileycreations15","/pwa")
    // dialogBox("top-left","notice","Please a few seconds to install the app.")
    deferredPrompt.prompt()

    document.body.removeChild(document.getElementById("installPrompt"))
		  deferredPrompt.userChoice
    .then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
	      	window.addEventListener('appinstalled', (evt) => {
  postSecure({"action":"pwaStatus","status":"pwa-install-success"});
});
    	postSecure({"action":"pwaStatus","status":"pwa-install-accept"});
	      if (window.matchMedia('(display-mode: standalone)').matches){
		      postSecure({"action":"pwaStatus","status":"pwa-after-install-launch"});
		      postSecure({"action":"pwaStatus","status":"pwa-launch"});
		      window.location.pathname = "/pwa"
		  } else {
		  	window.matchMedia('(display-mode: standalone)').addListener(function(e){
		if (e.matches && !a1){
			postSecure({"action":"pwaStatus","status":"pwa-after-install-launch"});
			postSecure({"action":"pwaStatus","status":"pwa-launch"});
			window.location.pathname = "/pwa"
			a1 = true
		}
	})
		  }
      } else {
    	postSecure({"action":"pwaStatus","status":"pwa-install-reject"});
      }
      deferredPrompt = null;
    });
    	postSecure({"action":"cachePwa"});
}
/*
if ("1" !== localStorage.getItem("welcome")){
  dialogBox("top-left","notice","Welcome! This site uses modern web technology. Please use a up to date browser to use many features!")
  localStorage.setItem("welcome","1")
}
if ("1" !== localStorage.getItem("cookie")){
  dialogBox("bar-bottom","plain","This site uses cookies and other web storage. By continuing to browse this site, you agree with the use of cookies.")
  localStorage.setItem("cookie","1")
}
*/
window.addEventListener('beforeinstallprompt', (e) => {
  postSecure({"action":"pwaStatus","status":"pwa-install-event-fired"});
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
  // Update UI notify the user they can add to home screen
  let b = document.createElement("a")
  b.onclick = installPWA
  b.id = "installPrompt"
    b.innerHTML = "Install app"
  let paths = ["/pwa","/pwa.html"]
  if (paths.includes(window.location.pathname)){ //  && savedPath === window.location.pathname
	// dialogBox("top-left","error","A unexpected event is triggered. Please reinstall the app.")
  	return
  }
  document.body.appendChild(b)
  // history.replaceState({},"smileycreations15",savedPath)
	/*
  init123 = setTimeout(function(){
    dialogBox("top-left","notice","Hi! You can install our app by clicking the 'Install app' button at the bottom right corner.")
  },20000)
  */
  // history.replaceState({},"smileycreations15",savedPath)
})
       // This is the "Offline copy of pages" service worker

// Add this below content to your HTML page, or add the js file to your page at the very top to register service worker

// Check compatibility for the browser we're running this in
        var getQueryString = function ( field, url = window.location.href ) {
	    var href = url ? url : window.location.href;
	    var reg = new RegExp( '[?&]' + field + '=([^&#]*)', 'i' );
	    var string = reg.exec(href);
	    return string ? string[1] : null;
    };
     if (window.location.pathname === "/pwa" || window.location.pathname === "/pwa.html"){
            document.getElementById("myProfile").href = "javascript:void(0)"
	     	     document.getElementById("myProfile").addEventListener("click",function(){openPwaUrl('https://github.com/smileycreations15')})
	     document.getElementById("openSource").href = "javascript:void(0)"
	     document.getElementById("openSource").addEventListener("click",function(){openPwaUrl('https://github.com/smileycreations15/smileycreations15.github.io')})
		// sessionStorage.setItem("pwa","true")
        }

window.dialogBox = function dialogBox(location = "top-left",type = "plain",dialogContent,black = true){
  let dialog = document.createElement("div")
  dialog.className = "notify " + location + " do-show font-notify"
  dialog.dataset.notificationStatus = type
  dialog.innerHTML = dialogContent
  let blackText = ["success","notice","error","warning"]
  if (blackText.includes(type) && black !== false){
    dialog.style.color = "black"
  }
  document.body.appendChild(dialog)
}
if (null !== document.getElementById("overlay")){
	document.body.removeChild(document.getElementById("overlay"))
}
window.showLoaderOverlay = function showOverlay(id,text = null){
  if (null !== document.getElementById(id)) return;
  let div = document.createElement("div")
  div.className = "overlay"
  div.id = id
  div.style.display = "none"
  document.body.appendChild(div)
  if (null === text || undefined === text){
    document.getElementById(id).outerHTML = '<div class="text-overlay">Loading</div><div class="progress-slider"><div class="line"></div><div class="progress-subline inc"></div><div class="progress-subline dec"></div></div>'
  } else {
    document.getElementById(id).outerHTML = '<div class="text-overlay">' + text + '</div><div class="progress-slider"><div class="line"></div><div class="progress-subline inc"></div><div class="progress-subline dec"></div></div>'
  }
  return {
    "element":document.getElementById(id),
    "show":function(){document.getElementById(id).style.display = "block"},
    "hide":function(){document.getElementById(id).style.display = "none"},
    "remove":function(){document.body.removeChild(document.getElementById(id))}
  }
}
