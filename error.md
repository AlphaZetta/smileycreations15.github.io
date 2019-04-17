<script>
let err = ["bottom-right", "top-left", "top-right", "bar-bottom", "bar-top", "bottom-right", "bottom-left"]
let err1 = ["warning","error","notice","plain","success"]
setInterval(function(){
let a = err1[Math.floor(Math.random()*err1.length)];
if ("error" === a){
smileycreations15.dialogBox(err[Math.floor(Math.random()*err.length)],"error","Error")
} else if ("success" === a) {
smileycreations15.dialogBox(err[Math.floor(Math.random()*err.length)],"success","Error created successfully.")
} else {
smileycreations15.dialogBox(err[Math.floor(Math.random()*err.length)],a,"A error is detected")
}
},500)
setInterval(function(){
let e = smileycreations15.showLoaderOverlay("load","Reporting error...")
e.show()
setTimeout(function(){
e.remove()
},1500)
},3000)
</script>
