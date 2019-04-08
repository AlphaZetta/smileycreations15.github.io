dialogBox = function dialogBox(location = "top-left",type = "plain",dialogContent,black = true){
  let dialog = document.createElement("div")
  dialog.className = "notify " + location + " do-show font-notify"
  dialog.dataset.notificationStatus = type
  dialog.innerHTML = dialogContent
  let blackText = ["success","notice","error","warning"]
  if (blackText.includes(type) && black !== false){
    dialog.style.color = "black"
  }
  document.body.appendChild(dialog)
}
