<?php
  include 'database.php';

  $id = $_POST['id'];
  $tempArray = [];
  $sql = "SELECT * FROM scenario_descriptions WHERE scenarios_id =?";
  $stmt = $conn->prepare($sql);
  $stmt->bind_param("i", $id);
  $stmt->execute();
  $result = $stmt->get_result();
  while ($row = $result->fetch_array(MYSQLI_ASSOC))
  {
      $tempArray[] = $row;
  }

  echo json_encode($tempArray);
 ?>
