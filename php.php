<?php
$image = imagecreate(300,200);
$bg = imagecolorallocatealpha($image,255,255,255,0);
$black = imagecolorallocate($image,255,255,255);
imagettftext($image,100, 0, 0, 0, $black, "https://fonts.gstatic.com/s/opensans/v15/mem8YaGs126MiZpBA-UFVZ0bf8pkAg.woff2", "test");
header('Content-Type: image/png');
imagepng($image);
?>
