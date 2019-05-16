---
title: Settings
---
<h2>Settings</h2>
<pre>
Play background music: <select class="" name="" oninput="toggle1()">
  <option disabled selected></option>
  <option value="enabled" id="b">Enable</option>
  <option value="disabled">Disable</option>
</select>
<script style="display:none">
function toggle1(){
  var stat = false
  if (document.getElementById('b').selected) stat = true
  smileycreations15.database.set("setting-backgronud-music",stat)
}
</script></pre>
