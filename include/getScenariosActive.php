<?php
  include 'database.php';

  $highScoreArray = [];
  $sql = "SELECT * FROM active_scenarios";
  $stmt = $conn->prepare($sql);
  $stmt->execute();
  $result = $stmt->get_result();
  while ($row = $result->fetch_array(MYSQLI_ASSOC))
  {
      $highScoreArray[] = $row;
  }

  echo json_encode($highScoreArray);
 ?>
