There is a bug 🐛 in Google Chrome that allows you to open 2 windows in 1 click.
Here is a demo:
<pre>
<a href="javascript:void:(0)" onclick="popup()">Click me!</a>
<script>
function popup(){
  window.open("about:blank")
  return false
}
</script>
</pre>
Code:

```html
<a href="javascript:void:(0)" onclick="popup()">Click me!</a>
<script>
function popup(){
  window.open("about:blank")
  return false
}
</script>
```
