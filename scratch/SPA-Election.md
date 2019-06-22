---
title: SPA Election Stats
header: SPA Election Stats
desc_note: Created by @smileycreations15.
---
<h2 id="countdown" style="text-align: center;font-size: 60px;margin-top: 0px;"></h2>

<script>
// Set the date we're counting down to
var countDownDate = new Date("Jun 23, 2019 00:00:00").getTime();

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
  document.getElementById("countdown").innerHTML = "Voting closes in: " days + " days " + hours + " hours "
  + minutes + " minutes " + seconds + " seconds ";
    
  // If the count down is over, write some text 
  if (distance < 0) {
    clearInterval(x);
    document.getElementById("countdown").innerHTML = "Voting has closed";
  }
}, 1000);
</script>
# Current Status: Tie
## SPA Election Stats

| Username       | Votes   |
|----------------|---------|
| LotusLavender  | 5 + Self vote |
| AFNNNetworkK12 | 5 + Self vote |

## Votes

| Username          | Vote             |
|-------------------|------------------|
| smileycreations15 | AFNNetworkK12    |
| NYCDOT            | LotusLavender    |
| MClovers          | AFNNetworkK12    |
| honeybreeze       | LotusLavender    |
| berryjam3506      | LotusLavender    |
| FrenchBread49     | AFNNetworkK12    |
| Scratch-Coding    | AFNNetworkK12    |
| AtheneNocturna    | LotusLavender    |
| GrahamSH          | AFNNetworkK12    |
| findanegg         | LotusLavender    |
