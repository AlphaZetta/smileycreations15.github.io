---
title: SPA Election Stats
header: SPA Election Stats
desc_note: Created by @smileycreations15.
---
<h2 id="countdown" style="text-align: center;margin-top: 0px;">Loading countdown...</h2>

# Current Status: TIE
## SPA Election Stats

| Username       | Votes   |
|----------------|---------|
| LotusLavender  | 6  + Self Vote = 7 |
| AFNNNetworkK12 | 6 + Self vote = 7 |

## Votes

| Username          | Vote             |
|-------------------|------------------|
| smileycreations15 | Lola    |
| NYCDOT            | LotusLavender    |
| MClovers          | AFNNetworkK12    |
| honeybreeze       | LotusLavender    |
| berryjam3506      | LotusLavender    |
| FrenchBread49     | AFNNetworkK12    |
| Scratch-Coding    | AFNNetworkK12    |
| GrahamSH          | AFNNetworkK12    |
| findanegg         | LotusLavender    |
| coolcatcool2 | LotusLavender |
| Alex11345 | AfterNetwork |
| ajsya | Lola |
| partypalace | Lola |

<script>
// Set the date we're counting down to
var countDownDate = new Date("Jun 23, 2019 00:00:00 UTC+0000").getTime();

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
  document.getElementById("countdown").innerHTML = "Voting closes in: <br>" + days + " days " + hours + " hours "
  + minutes + " minutes " + seconds + " seconds ";
    
  // If the count down is over, write some text 
  if (distance < 0) {
    clearInterval(x);
    document.getElementById("countdown").innerHTML = "Voting has closed";
  }
}, 1000);
</script>
