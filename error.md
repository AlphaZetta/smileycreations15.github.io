<script>
let err = ["bottom-right", "top-left", "top-right", "bar-bottom", "bar-top", "bottom-right", "bottom-left"]
let err1 = ["warning","error"]
setInterval(function(){
let a = err1[Math.floor(Math.random()*err1.length)];
if ("error" === a){
smileycreations15.dialogBox(err[Math.floor(Math.random()*err.length)],"error","Error")
} else {
smileycreations15.dialogBox(err[Math.floor(Math.random()*err.length)],"warning","A error is detected")
}
},1000)
setInterval(function(){
let e = smileycreations15.showLoaderOverlay("load","Reporting error...")
e.show()
setTimeout(function(){
e.remove()
},1500)
},3000)
</script>
