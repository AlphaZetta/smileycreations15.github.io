dialogBox = function dialogBox(location = "top-left",type = "plain",dialogContent){
  let dialog = document.createElement("div")
  dialog.className = "notify " + location + " do-show font-notify"
  dialog.dataset.notificationStatus = type
  dialog.innerHTML = dialogContent
  document.body.appendChild(dialog)
}
