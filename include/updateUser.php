<?php
  include 'database.php';
  $id = $_POST['id'];
  $name = $_POST['name'];
  $level = $_POST['level'];
  $pass = sha1($_POST['pass']);
  $sql = "UPDATE `users` SET `username`=?, `password` = ?, `userlevel` = ? WHERE id = ?";
  $stmt = $conn->prepare($sql);
  $stmt->bind_param('ssii',$name, $pass, $level, $id);
  $result = $stmt->execute();
  if ($result) {
    echo 'succes';
  }


?>
