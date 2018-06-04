<?php
  include 'database.php';

  $id = $_POST['id'];

  $delete = "DELETE FROM `users` WHERE `id`=$id";

  if (mysqli_query($conn, $delete)) {
      echo 'succes';
  } else {
    echo "Error: " . "<br>" . mysqli_error($connect);
  }
 ?>
