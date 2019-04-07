dialogBox = function(location = "top-left",type = "plain"){
  let dialog = document.createElement("div")
  dialog.className = "notify " + location + " do-show"
  dialog.notificationStatus = type
  document.body.appendChild(dialog)
}
