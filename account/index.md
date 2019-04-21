## smileycreations15 Account Management
<h2>Username</h2>
<p id="username-state"></p>
<h2>GitHub Login</h2>
<button onclick="authorize()">Authorize</button>
<p id="load"></p>
<h2>Revoke all sessions</h2>
Revoking your session will log you out from all devices.
<button onclick="revoke()" id="revoke">Revoke all sessions</button>
<script>
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function authorize() {
    let state = uuidv4()
    sessionStorage.setItem("state-github-basic-auth", state)
    document.getElementById("load").innerHTML = "Please wait..."
    open("http://github.com/login/oauth/authorize?client_id=691fff7551bb080c0ab2&state=" + state + "&redirect_uri=https://smileycreations15.com/account/authorize-basic", "_self")
}

function revoke() {
    fetch("https://smileycreations15.wixsite.com/analytics/_functions/github_revoke?json=" + encodeURIComponent(JSON.stringify({
        "user": localStorage.getItem("github-username"),
        "token": localStorage.getItem("cookie-github")
    })), {
        "method": "POST"
    }).then(e => {
        localStorage.removeItem("github-username")
        localStorage.removeItem("cookie-github")
        window.location.reload()
    }).catch(() => {})
}
if (null === localStorage.getItem("github-username")) {
    document.getElementById("username-state").innerHTML = "Not logged in with GitHub.<br><br><button onclick='authorize()'>Log in</button>"
    document.getElementById("revoke").setAttribute("disabled", "disabled")
} else {
    document.getElementById("username-state").innerHTML = "Logged in as " + escapeHtml(localStorage.getItem("github-username")) + ".<br><br><button onclick='logout()'>Log out</button>"
}

function logout() {
    localStorage.removeItem("github-username")
    localStorage.removeItem("cookie-github")
    window.location.reload()
}
</script>
