// ==UserScript==
// @name         SOBotics Tools
// @description  Tools for the SOBotics chatroom
// @version      1.7.0
// @author       smileycreations15 (https://github.com/smileycreations15)
// @match        https://chat.stackoverflow.com/rooms/111347/sobotics
// @match        https://chat.stackoverflow.com/rooms/111347/sobotics?c=*&r=true
// @match        https://chat.stackoverflow.com/rooms/111347/sobotics?*
// @match        https://chat.stackoverflow.com/rooms/111347/sobotics/
// @match        https://chat.stackoverflow.com/rooms/111347/sobotics/?*
// @grant        GM_listValues
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// ==/UserScript==

(function() {
  fetch("https://smileycreations15.github.io/files/text/sobotics_tools_userscript_news.json", {cache: "no-cache"}).then((resp) => resp.json()).then(function(data) {if ("Nothing to show." !== data.news && GM_getValue("news-dismiss") !== data.id){GM_setValue("news-dismiss", data.id);alert(data.news)}})
  document.getElementById("roomdesc").innerHTML = document.getElementById("roomdesc").innerHTML + '<div id=\"smileycreations15-tools\"><h3><br>Tools</h2><hr><div id=\"smileycreations15-tools-buttons\"></div>'
    fetch("https://smileycreations15.github.io/files/text/sobotics_tools_userscript.json", {cache: "no-cache"})
        .then((resp) => resp.json()) // Transform the data into json
        .then(function(data) {
        if (GM_getValue("update-dismiss") === data.version){
        } else {
            if (data.version !== "1.7.0"){
                alert(data.updateMsg + " Click \"Install script update\" to install the update")
                GM_setValue("update-dismiss", data.version)
            }
        }
            if (data.version !== "1.7.0"){
                document.getElementById("smileycreations15-tools-buttons").innerHTML = document.getElementById("smileycreations15-tools-buttons").innerHTML + '<a href=\"https://github.com/smileycreations15/smileycreations15.github.io/raw/master/files/userscripts/sobotics_tools.user.js\" id=\"smileycreations15-tools-buttons-installUpdate\" target=\"_self\"><button class=\"button\" id=\"smileycreations15-tools-buttons-installUpdate-button\">Install script update<\/button><\/a>'
            }
    })
    // Natty report button
    document.getElementById("smileycreations15-tools-buttons").innerHTML = document.getElementById("smileycreations15-tools-buttons").innerHTML + '<a href=\"javascript:window.open(\'https:\/\/smileycreations15.github.io\/stackoverflow-stuff\/stackoverflow-report\',\'\', \'width = 700, height = 250\')\" id=\"smileycreations15-tools-buttons-feedbackToNatty\"><button class=\"button\" id=\"smileycreations15-tools-buttons-feedbackToNatty-button\">send answer feedback (Natty)<\/button><\/a>'
    document.getElementById("smileycreations15-tools-buttons").innerHTML = document.getElementById("smileycreations15-tools-buttons").innerHTML + '&nbsp;<a href=\"javascript:document.getElementById(\'input\').value = \'@Housekeeping open\';document.getElementById(\'sayit-button\').click()\" id=\"smileycreations15-tools-buttons-getNattyLinks\"><button class=\"button\" id=\"smileycreations15-tools-buttons-getNattyLinks-button\">get Natty links<\/button><\/a>'
    document.getElementById("smileycreations15-tools-buttons").innerHTML = document.getElementById("smileycreations15-tools-buttons").innerHTML + '&nbsp;<a href=\"javascript:fetch(\'https://smileycreations15.github.io/files/text/sobotics_tools_userscript_news.json\', {cache: \'no-cache\'}).then((resp) => resp.json()).then(function(data) {alert(data.news)})\" id=\"smileycreations15-tools-buttons-getStatus\"><button class=\"button\" id=\"smileycreations15-tools-buttons-getStatus-button\">get status<\/button><\/a>'
    function getQueryVariable(variable){
        var query = window.location.search.substring(1);
        var vars = query.split("&")
        for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
            if(pair[0] == variable){return decodeURIComponent(pair[1]);}
        }
        return(null);
    }
    function sleep(milliseconds) {
        var start = new Date().getTime();
        for (var i = 0; i < 1e7; i++) {
            if ((new Date().getTime() - start) > milliseconds){
                break;
            }
        }
    }

    if (getQueryVariable("r") === "true"){
        const data = ["Sending request..."]
        document.getElementById("loading-message").innerHTML = data[getQueryVariable("i")]
        document.getElementById("input").value = getQueryVariable("c")
        document.getElementById("sayit-button").click()
        let data1 = ["Sent.", "Message sent."]
        let data2 = [true, true]
        if (data2[getQueryVariable("i")] === true){
          alert(data1[getQueryVariable("i")])
        }
        window.close()
    }/*
        if (getQueryVariable("b") === "1"){

            window.history.replaceState("", "", window.location.pathname);
        }
        */
})();
