let _ = {};
_["setCookie"] = function(cname, cvalue, exdays) { 
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
_["setSessionCookie"] = function(cname, cvalue) {
  document.cookie = cname + "=" + cvalue + ";" + ";path=/";
}
_["getCookie"] = function(cname) {
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
_["rmCookie"] = function(cname) {
  socument.cookie = cname + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
}
_["dnsLookup"] = function(domain, recordType){
  return new Promise(function(resolve, reject){
  fetch("https://cloudflare-dns.com/dns-query?name=" + encodeURIComponent(domain) + "&type=" + encodeURIComponent(recordType),{"headers":{"accept":"application/dns-json"}}).then(function(response){
    if (response.ok){
      resolve(response.json().Answer)
    } else {
      reject("Status code not 200. Status code: " + response.status)
    }
  }).catch(function(error){
    reject(error)
  })
  });
}
