<?php
  include 'database.php';
  $id = $_POST['id'];
  $name = $_POST['name'];
  $pass = sha1($_POST['pass']);
  $sql = "UPDATE `users` SET `username`=?, `password` = ? WHERE id = ?";
  $stmt = $conn->prepare($sql);
  $stmt->bind_param('ssi',$name, $pass, $id);
  $result = $stmt->execute();
  if ($result) {
    echo 'succes';
  }


?>
