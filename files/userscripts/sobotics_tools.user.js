// ==UserScript==
// @name         SOBotics Tools
// @description  Tools for the SOBotics chatroom
// @version      1.0.0
// @author       smileycreations15 (https://github.com/smileycreations15)
// @match        https://chat.stackoverflow.com/rooms/111347/sobotics
// @match        https://chat.stackoverflow.com/rooms/111347/sobotics?c=*&r=true
// @match        https://chat.stackoverflow.com/rooms/111347/sobotics?*
// @match        https://chat.stackoverflow.com/rooms/111347/sobotics/
// @match        https://chat.stackoverflow.com/rooms/111347/sobotics/?*
// ==/UserScript==

(function() {
    // Natty report button
    document.getElementById("roomdesc").innerHTML = document.getElementById("roomdesc").innerHTML + '<div id=\"smileycreations15-tools\"><h3><br>Tools</h2><hr><div id=\"smileycreations15-tools-buttons\"></div>'
    document.getElementById("smileycreations15-tools-buttons").innerHTML = document.getElementById("smileycreations15-tools-buttons").innerHTML + '<a href=\"https://smileycreations15.github.io/stackoverflow-stuff/stackoverflow-report\" target=\"_self\" id=\"smileycreations15-tools-buttons-reportToNatty\"><button class="button" id=\"smileycreations15-tools-buttons-feedbackToNatty-button\">send answer feedback (Natty)</button></a>'
    function getQueryVariable(variable){
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return decodeURIComponent(pair[1]);}
       }
       return(null);
}
    if (getQueryVariable("r") === "true"){
        const data = ["Sending request..."]
        document.getElementById("loading-message").innerHTML = data[getQueryVariable("i")]
        document.getElementById("input").value = getQueryVariable("c")
        document.getElementById("sayit-button").click()
        open("https://" + window.location.hostname + window.location.pathname,"_self")
    }/*
        if (getQueryVariable("b") === "1"){
            let data = ["Sent."]
            alert(data[getQueryVariable("a")])
            window.history.replaceState("", "", window.location.pathname);
        }
        */
})();
