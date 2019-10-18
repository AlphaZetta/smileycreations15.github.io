---
title: Scratch Wiki Voting Countdown
header: Scratch Wiki Voting Countdown
desc_note: Created by @smileycreations15. (unofficial)
desc: Created by @smileycreations15. (unofficial)
links: []
---
<h1 id="countdown" style="text-align: center;margin-top: 0px;">Loading countdown...</h1>

## Users

- apple502j
- Jammum
- MClovers
- TenType


<script>
// Set the date we're counting down to
var countDownDate = new Date("19 October, 2019 00:00:00 UTC+0000").getTime();

// Update the count down every 1 second
var x = setInterval(function() {

  // Get today's date and time
  var now = new Date().getTime();
    
  // Find the distance between now and the count down date
  var distance = countDownDate - now;
    
  // Time calculations for days, hours, minutes and seconds
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
  // Output the result in an element with id="demo"
  document.getElementById("countdown").innerHTML = "Voting opens in: " + days + " days " + hours + " hours "
  + minutes + " minutes " + seconds + " seconds ";
  logger.debug("Voting opens in: " + days + " days " + hours + " hours "
  + minutes + " minutes " + seconds + " seconds ")
    
  // If the count down is over, write some text 
  if (distance < 0) {
    clearInterval(x);
    document.getElementById("countdown").innerHTML = "Voting has opened";
    logger.debug("Voting opened.")
    instantiateOpen()
  }
}, 1000);
function instantiateOpen(){
    logger.success("Initiated close countdown.")

  var countDownDate2 = new Date("26 October, 2019 00:00:00 UTC+0000").getTime();
  y = setInterval(function() {

    // Get today's date and time
    var now = new Date().getTime();

    // Find the distance between now and the count down date
    var distance = countDownDate2 - now;

    // Time calculations for days, hours, minutes and seconds
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Output the result in an element with id="demo"
    document.getElementById("countdown").innerHTML = "Voting closes in: " + days + " days " + hours + " hours "
    + minutes + " minutes " + seconds + " seconds ";
  logger.debug("Voting closes in: " + days + " days " + hours + " hours "
  + minutes + " minutes " + seconds + " seconds ")
    // If the count down is over, write some text 
    if (distance < 0) {
      clearInterval(y);
      document.getElementById("countdown").innerHTML = "Voting has closed.";
        logger.debug("Voting closed.")
    }
  }, 1000);
}
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function create_UUID() {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}
logger = {}
var consoleCopy = console
logger.event = (e) => {
    consoleCopy.log("%c[Event]%c" + e, "color:#fff;padding:20px;border-radius:12px 0px 0px 12px;background-color:#5f5f5f;", "color:#fff;padding:20px;border-radius:0px 12px 12px 0;background-color:#5f5f5f;")

}
logger.log = (e) => {
    consoleCopy.log("%c[Log]%c" + e, "color:#fff;padding:20px;border-radius:12px 0px 0px 12px;background-color:#5f5f5f;", "color:#fff;padding:20px;border-radius:0px 12px 12px 0;background-color:#5f5f5f;")

}
logger.info = (e) => {
    consoleCopy.log("%c[Info]%c" + e, "color:#fff;padding:20px;border-radius:12px 0px 0px 12px;background-color:#5f5f5f;", "color:#fff;padding:20px;border-radius:0px 12px 12px 0;background-color:#5f5f5f;")

}
logger.debug = (e) => {
    consoleCopy.log("%c[Debug]%c" + e, "color:#fff;padding:20px;border-radius:12px 0px 0px 12px;background-color:#5f5f5f;", "color:#fff;padding:20px;border-radius:0px 12px 12px 0;background-color:#5f5f5f;")

}
logger.success = (e) => {
    consoleCopy.log("%c[Success]%c" + e, "color:#fff;padding:20px;border-radius:12px 0px 0px 12px;background-color:green;", "color:#fff;padding:20px;border-radius:0px 12px 12px 0;background-color:#5f5f5f;")

}
logger.error = (e) => {
    consoleCopy.log("%c[Error]%c" + e, "color:#fff;padding:20px;border-radius:12px 0px 0px 12px;background-color:red;", "color:#fff;padding:20px;border-radius:0px 12px 12px 0;background-color:#5f5f5f;")

}
logger.warn = (e) => {
    consoleCopy.log("%c[Warning]%c" + e, "color:#fff;padding:20px;border-radius:12px 0px 0px 12px;background-color:#b7b700;", "color:#fff;padding:20px;border-radius:0px 12px 12px 0;background-color:#5f5f5f;")

}
    
logger.info("Hi! Want to contribute? Open an issue here: https://github.com/smileycreations15/smileycreations15.github.io/issues")
console.groupCollapsed("Countdown")
logger.success("Initiated start countdown.")
</script>
