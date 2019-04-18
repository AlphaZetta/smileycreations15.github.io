<script>
let err = ["bottom-right", "top-left", "top-right", "bar-bottom", "bar-top", "bottom-right", "bottom-left"]
let err1 = ["warning","error","notice","plain","success"]
b = 1250
  fdf = 3000
function ed(){
let a = err1[Math.floor(Math.random()*err1.length)];
if ("error" === a){
smileycreations15.dialogBox(err[Math.floor(Math.random()*err.length)],"error","Error")
} else if ("success" === a) {
smileycreations15.dialogBox(err[Math.floor(Math.random()*err.length)],"success","Error created successfully.")
} else {
smileycreations15.dialogBox(err[Math.floor(Math.random()*err.length)],a,"A error is detected")
}
  setTimeout(ed,b)
}
setTimeout(ed,b)
  function eaee(){
  let e = smileycreations15.showLoaderOverlay("load","Reporting error...")
e.show()
setTimeout(function(){
e.remove()
},fdf / 2)
  }
setInterval(eaee,fdf)
</script>
