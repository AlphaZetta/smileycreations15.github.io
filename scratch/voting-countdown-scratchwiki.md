---
title: Scratch Wiki Voting Countdown
header: Scratch Wiki Voting Countdown
desc_note: Created by @smileycreations15. (unofficial)
desc: Created by @smileycreations15. (unofficial)
links: []
---
<h1 id="countdown" style="text-align: center;margin-top: 0px;">Loading countdown...</h1>

## Users

_Users list yet to be prepared_


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
  document.getElementById("countdown").innerHTML = "Voting opens in: <br>" + days + " days " + hours + " hours "
  + minutes + " minutes " + seconds + " seconds ";
    
  // If the count down is over, write some text 
  if (distance < 0) {
    clearInterval(x);
    document.getElementById("countdown").innerHTML = "Voting has opened";
    instantiateOpen()
  }
}, 1000);
function instantiateOpen(){
  var countDownDate2 = new Date("26 October, 2019 00:00:00 UTC+0000").getTime();
  var y = setInterval(function() {

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
    document.getElementById("countdown").innerHTML = "Voting closes in: <br>" + days + " days " + hours + " hours "
    + minutes + " minutes " + seconds + " seconds ";

    // If the count down is over, write some text 
    if (distance < 0) {
      clearInterval(y);
      document.getElementById("countdown").innerHTML = "Voting has closed.";
    }
  }, 1000);
}
</script>
