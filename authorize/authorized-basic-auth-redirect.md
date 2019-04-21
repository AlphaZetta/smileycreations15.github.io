<h2>Authorize</h2>
<p id="auth-status">Authorizing...</p>
<script>
function getQueryVariable(variable){
   var query = window.location.search.substring(1);
   var vars = query.split("&");
   for (var i=0;i<vars.length;i++) {
           var pair = vars[i].split("=");
           if(pair[0] == variable){return decodeURIComponent(pair[1]);}
   }
   return(null);
}
                                 function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
 }
if (sessionStorage.getItem("state-github-basic-auth") !== getQueryVariable("state")){
  document.getElementById("auth-status").innerHTML = "Authorization failed.<br><code>state</code> parameter does not match.<br>File a <a href='https://github.com/smileycreations15/smileycreations15.github.io/issues/new'>issue</a> with the error message for more info."
                                   history.replaceState({},"Authorization failure",window.location.pathname)
} else {
  document.getElementById("auth-status").innerHTML = "Processing token..."
  fetch("https://smileycreations15.wixsite.com/analytics/_functions/api_key_github?api-key=" + encodeURIComponent(getQueryVariable("code")))
  .then(a=>{return a.json()})
  .then(data=>{
  if (data.error === "invalidScope"){
    document.getElementById("auth-status").innerHTML = "Code has expired or scope is invalid.<br>File a <a href='https://github.com/smileycreations15/smileycreations15.github.io/issues/new'>issue</a> with the error message for more info."
   history.replaceState({},"Authorization failure",window.location.pathname)
  } else {
    localStorage.setItem("github-basic-token",data.token)
   document.getElementById("auth-status").innerHTML = "Your GitHub account authorization is complete. <br>Username: " + escapeHtml(data.login) + "<br><a href='/'>Go to homepage</a>"
   history.replaceState({},"Authorization success",window.location.pathname)
  }
  }).catch(e=>{
  document.getElementById("auth-status").innerHTML = "A error occured. <br>" + e.toString() + "<br>File a <a href='https://github.com/smileycreations15/smileycreations15.github.io/issues/new'>issue</a> with the error message for more info."
   history.replaceState({},"Authorization failure",window.location.pathname)
  })
   history.replaceState({},"Authorizing...",window.location.pathname)
}
</script>
