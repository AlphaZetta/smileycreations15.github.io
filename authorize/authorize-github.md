## Authorize GitHub profile access
Authorizing will allow us to access public profile info.<br><br>
<button onclick="authorize()">Authorize</button>
<p id="load"></p>
<script>
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
function authorize(){
  let state = uuidv4()
  sessionStorage.setItem("state-github-basic-auth",state)
  document.getElementById("load").innerHTML = "Please wait..."
  open("http://github.com/login/oauth/authorize?client_id=691fff7551bb080c0ab2&state=" + state + "&redirect_uri=https://smileycreations15.com/authorize/authorized-basic-auth-redirect","_self")
}
</script>
