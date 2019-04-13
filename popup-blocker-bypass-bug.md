There is a bug 🐛 in Google Chrome that allows you to open 2 windows in 1 click.
Here is a demo:
<pre>
<a href="javascript:void:(0)" onclick="popup()">Click me!</a>
<script>
	    function popup(t){
		    var otherWindow = window.open("about:blank","","resizable=1,width=" + String(screen.width / 2) + ",height=" + String(screen.height / 2));otherWindow.document.title = "Loading..."; otherWindow.opener = null; otherWindow.location = t; return false;
	    }
</script>
</pre>
Code:

```html
<a href="javascript:void:(0)" onclick="popup()">Click me!</a>
<script>
	    function popup(t){
		    var otherWindow = window.open("about:blank","","resizable=1,width=" + String(screen.width / 2) + ",height=" + String(screen.height / 2));otherWindow.document.title = "Loading..."; otherWindow.opener = null; otherWindow.location = t; return false;
	    }
</script>
```
