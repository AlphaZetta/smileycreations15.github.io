<h3 id="to-set-your-username-on-this-github-pages-website-click-the-button-below">HTML Editor v1.0</h3>
<textarea rows="4" cols="50" id="htmlData">
<!DOCTYPE HTML>
<html>
<body>
</body>
</html>
<form onsubmit="return embed()">
<input type="submit" title="Run the following HTML code in the box below" value="Run HTML Code">
</form>
<p></p>
<iframe id="embed" src="about:blank" height="700" width="800">
</iframe>
			
<script>
function embed() {
var doc = document.getElementById('embed').contentWindow.document;
doc.open();
doc.write(document.getElementById('htmlData').value);
doc.close();
return false
}
</script>
