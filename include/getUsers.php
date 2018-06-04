<?php
  include 'database.php';

  $highScoreArray = [];
  $sql = "SELECT * FROM users";
  $stmt = $conn->prepare($sql);
  $stmt->execute();
  $result = $stmt->get_result();
  while ($row = $result->fetch_array(MYSQLI_ASSOC))
  {
      $row["password"] = sha1($row["password"]);
      $highScoreArray[] = $row;
  }

  echo json_encode($highScoreArray);
 ?>
