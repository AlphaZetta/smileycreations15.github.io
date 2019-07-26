# Token ready:
<p>Token: <span id="a"></span></p>
<script>
document.getElementById("a").innerHTML = new URL(window.location.href).searchParams.get("code")
</script>
