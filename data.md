<h2>:)</h2>
<p id="data"></p>
<script src="https://smileycreations15.com/files/javascript/libraries/cookies.min.js"></script>
<script>
var resized = 0
function refreshData(){
document.getElementById("data").innerHTML = "Screen size (height, px): " + outerHeight + "\nScreen size: (width, px): " + outerWidth + "\nWindow size (width, px): " + innerWidth + "\nWindow size (height, px): " + innerHeight + "<br>";
_.setCookie("testCookie","test",1)
if (_.getCookie("testCookie") === "test"){
  document.getElementById("data").innerHTML = document.getElementById("data").innerHTML + "\nCookies are enabled: true<br>"
} else {
  document.getElementById("data").innerHTML = document.getElementById("data").innerHTML + "\nCookies are enabled: false<br>"
}
document.getElementById("data").innerHTML + "\nPages visited before this page: " + String(history.length - 2) + "<br>"
document.getElementById("data").innerHTML = document.getElementById("data").innerHTML + "\nPage that redirected you here: " + document.referrer + "<br>"
document.getElementById("data").innerHTML = document.getElementById("data").innerHTML + "\nPage that redirected you here: " + document.referrer + "<br>"
document.getElementById("data").innerHTML = document.getElementById("data").innerHTML + "\nWindow resized " + resized + " times" + "<br>"
resized++
}
refreshData()
window.addEventListener("resize", refreshData);
</script>
