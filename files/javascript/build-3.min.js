try {
    let e = window.location.hash.split("#")[window.location.hash.split("#").length - 1]
    let jsonData1 = JSON.parse(e)
    fetch("https://smileycreations15.wixsite.com/backend/_functions/github_create_page",{
      "method":"POST",
      "body":JSON.stringify({
          user: localStorage.getItem("github-username"),
          token: localStorage.getItem("cookie-github"),
          "404":jsonData1["404"],
          "homepage":jsonData1["homepage"]
    })}).then(function(e){
    window.location.pathname = "/website-builder/success"
    })
} catch(e){}
