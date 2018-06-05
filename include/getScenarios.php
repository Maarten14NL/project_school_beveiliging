<?php
  include 'database.php';

  $tempArray = [];
  $sql = "SELECT * FROM scenarios";
  $stmt = $conn->prepare($sql);
  $stmt->execute();
  $result = $stmt->get_result();
  while ($row = $result->fetch_array(MYSQLI_ASSOC))
  {
      $tempArray[] = $row;
  }

  echo json_encode($tempArray);
 ?>
