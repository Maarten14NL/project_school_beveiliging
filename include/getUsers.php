<?php
  include 'database.php';

  $highScoreArray = [];

  $highScoreQuery = mysqli_query($conn,"SELECT * FROM `users`");

  while($row = mysqli_fetch_assoc($highScoreQuery))
  {
    $row["password"] = sha1($row["password"]);
    // echo json_encode($row["password"]);
    $highScoreArray[] = $row;
  }

  echo json_encode($highScoreArray);
 ?>
