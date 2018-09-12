<?php
$path = '../sounds';
$files = scandir($path);
$files = array_diff(scandir($path), array('.', '..'));
$data = array_values($files);
echo json_encode($data);

 ?>
