export function setCookie(cname, cvalue, exdays) { // cname = cookie name, cvalue = cookie value, exdays = days the cookie will expire on
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

// Set a session cookie
export function setSessionCookie(cname, cvalue) { // cname = cookie name, cvalue = cookie value
  document.cookie = cname + "=" + cvalue + ";" + ";path=/";
}

// Get a cookie
export function getCookie(cname) { // cname = cookie name
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
  return "";
}

// Delete a cookie
export function deleteCookie(cname) { // cname = cookie name
  socument.cookie = cname + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
}
