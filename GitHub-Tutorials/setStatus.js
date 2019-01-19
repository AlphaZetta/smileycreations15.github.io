function setCookie(cname,cvalue,exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires=" + d.toGMTString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
function setStatus(status, tutorial){
  if (getCookie("tutorials") === ""){
    let data13456 = {}
    setCookie("tutorials", JSON.stringify(data13456), 9999)
  }
  var cookieData = getCookie("tutorials")
  var parsedData = JSON.parse(cookieData)
  eval("parsedData." + tutorial + " = " + status)
  setCookie("tutorials", JSON.stringify(parsedData), 9999)
 }

function getStatus(tutorial){
    if (getCookie("tutorials") === ""){
    let data13456 = {}
    setCookie("tutorials", JSON.stringify(data13456), 9999)
  }
  var cookieData = getCookie("tutorials")
  var parsedData = JSON.parse(cookieData)
  eval("var tutorialData = parsedData." + tutorial)
  if (undefined === tutorialData){
    return ""
  } else {
    return tutorialData
  }
}
function setStatus(tutorial){
  document.getElementById("status").innerHTML = getstatus(tutorial)
}
