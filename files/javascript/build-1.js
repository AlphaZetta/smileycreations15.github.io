function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function auth() {
    let state = uuidv4()
    sessionStorage.setItem("state-github-basic-auth", state)
    open("https://github.com/login/oauth/authorize?client_id=691fff7551bb080c0ab2&state=" + state + "&scope=public_repo&redirect_uri=https://smileycreations15.com/website-builder/auth", "_self")
}

function build_site() {
    if (localStorage.getItem("github-scope") === null) {
        auth()
        return
    }
    if (!localStorage.getItem("github-scope").split(",").includes("public_repo")) {
        auth()
        return
    }
    window.open("/website-builder/1")
}
