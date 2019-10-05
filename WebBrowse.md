## WebBrowse
Browse a moderated web.  
<input type="text" placeholder="URL" onkeydown="if (event.keyCode === 13){document.querySelector('#i').src = `/files/websites/${this.value}`}">
<iframe src="about:blank" id="i" style="width:100%;height:75vh;display:block;"></iframe>
(Press enter to submit URL)

