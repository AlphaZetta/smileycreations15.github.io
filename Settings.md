---
title: Settings
---
<h2>Settings</h2>
Play background music: <select class="" name="">
  <option disabled selected></option>
  <option value="enabled" id="b">Enable</option>
  <option value="disabled">Disable</option>
</select><br>
<button onclick="toggle1()">Save changes</button>
<script style="display:none">
function toggle1(){
  var b = smileycreations15.modal('<h2>Save changes</h2><p>Saving changes will reload all tabs.</p><button onclick="toggle()">Continue</button><button onclick="a.remove()">Cancel</button>')
  window.a = b.element
}
function toggle(){
  a.remove()
  var stat = false
  if (document.getElementById('b').selected) stat = true
  smileycreations15.database.set("setting-backgronud-music",stat)
  if (navigator.serviceWorker.controller){
    smileycreations15.modal('<h2>Please wait...</h2><div autofocus style="width:0%" tabindex="0"></div>')
    navigator.serviceWorker.controller.postMessage({"action":"reloadAll"})
  }
}
</script>
