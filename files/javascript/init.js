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
