# THIS EXAMPLE IS A BAD CLIENT-SIDE EXAMPLE PLEASE GO TO [THIS](https://pastoral-staircase.glitch.me) EXAMPLE FOR A SERVER-SIDE EXAMPLE.
## Verify your Scratch identity
Enter your username and post the following code [here](https://scratch.mit.edu/projects/318086755/) then click Submit.<br><br>
<input type="text" id="username" placeholder="Username"><br><br>
Code: <code id="code"></code><br><br>
<button onclick="verify()">Submit</button>
<p id="status">Waiting for submission of form...</p>
<script>
var randomid = (function makeid(length) {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
})(20)
document.getElementById("code").innerHTML = randomid
function verify(){
document.getElementById("status").innerHTML = "Loading..."
  fetch("https://cors-anywhere.herokuapp.com/https://obscure-inlet-57587.herokuapp.com/verify",{headers:{username:document.getElementById("username").value,nonce:randomid}})
  .then(e=>{
  return e.json()
  })
  .then(e=>{
  if(e.valid){
  document.getElementById("status").innerHTML = "Verified"
  } else {
  document.getElementById("status").innerHTML = "Declined"
  }
  })
}
</script>
