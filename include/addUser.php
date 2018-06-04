<?php
include 'database.php';

$name = $_POST['username'];
$password = sha1($_POST['userpassword']);
$level = $_POST['userlevel'];
// echo json_encode($_POST);

$insert = "INSERT INTO `users` (`username`, `password`, `userlevel`)
  VALUES ('$name','$password','$level');";

if (mysqli_query($conn, $insert)) {
  echo " succes";
} else {
  echo " Error: " . $insert . "<br>" . mysqli_error($conn);
}
 ?>
