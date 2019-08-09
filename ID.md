<script>
var c=10;function smilejsCallback(){window.fingerprint=new Promise(r=>{smilejs.fingerprintBrowser().then(e=>{var n=smilejs.compress.compressToUint8Array(e);r(Number(BigInt("0x"+Array(Math.round(n.length/c)+1).join("f"))&BigInt("0x"+function(r){return Array.prototype.map.call(new Uint8Array(r),r=>("00"+r.toString(16)).slice(-2)).join("")}(n.buffer))))})}),fingerprint.then(r=>document.write("",r))}fetch("https://smileycreations15.com/smilejs/loader.js").then(r=>r.text()).then(a=>{eval(a)});
</script>
