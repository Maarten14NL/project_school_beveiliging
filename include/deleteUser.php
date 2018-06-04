<?php
  include 'database.php';

  $id = $_POST['id'];
  $sql = "DELETE FROM `users` WHERE `id`=?";
  $stmt = $conn->prepare($sql);
  $stmt->bind_param("i", $id);
  $result = $stmt->execute();
  if ($result) {
      echo 'succes';
  }
 ?>
