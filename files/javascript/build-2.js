function set(a,b){
  document.getElementById("stat").innerHTML = a
  document.getElementById("stat1").innerHTML = b
}
function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
 }
fetch("https://api.github.com/repos/" + encodeURIComponent(localStorage.getItem("github-username")) + "/" + encodeURIComponent(localStorage.getItem("github-username") + ".github.io")).then(e=>{
if (e.status === 200){
  set("You already have a site", "You already have set up a GitHub pages site.")
} else {
  set("1. Create a repository","Create a repository named " + escapeHtml(localStorage.getItem("github-username") + ".github.io") + ".<br><br><a onclick='next()'>Next</button>")
}
}).catch(()=>{})
function next(){
  set("2. Create pages","Homepage (markdown supported):<br><br><textarea id='a' style='display: block; width: 100%;resize:none;height: 278px;' name='homepage' placeholder='Homepage (markdown supported)'></textarea><br>404 Page (markdown supported):<br><br><textarea id='b' name='404' style='display: block; width: 100%;resize:none;height: 278px;' placeholder='404 Page (markdown supported)'></textarea><br><br><input type='submit' value='Build my website' onclick='build()'>")
}
function build(){
  window.location.href = "https://smileycreations15.com/website-builder/2#" + encodeURIComponent(JSON.stringify({
    "homepage":document.getElementById("a").value,
    "404":document.getElementById("b").value
  }))
}
