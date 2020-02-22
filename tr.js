
function tracc(a){var n=new URLSearchParams;n.append("uagent",navigator.userAgent),n.append("action",a),n.append("page",location.href),navigator.sendBeacon("https://hospitable-floss-e4rhqoh9c9.glitch.me/",n)}tracc("enter"),addEventListener("beforeunload",function(){tracc("unload")});
