<?php
  include 'database.php';
  $id = $_POST['id'];
  $name = $_POST['name'];
  $pass = sha1($_POST['pass']);

  $update = "UPDATE `users` SET `username`='$name', `password` = '$pass' WHERE id=$id";

  // echo json_encode($_POST);
  // echo $update;

  if (mysqli_query($conn, $update)) {
      echo 'succes';
  } else {
    echo "Error: " . "<br>" . mysqli_error($conn);
    // echo json_encode('fail');
  }
?>
