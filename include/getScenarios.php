<?php
include 'database.php';
$tempArray = [];
if (!isset($_POST['category'])) {
  $sql = "SELECT * FROM scenarios";
  $stmt = $conn->prepare($sql);
  $stmt->execute();
  $result = $stmt->get_result();
  while ($row = $result->fetch_array(MYSQLI_ASSOC))
  {
    $tempArray[] = $row;
  }
}
else {
  $category = $_POST['category'];
  $sql = "SELECT * FROM scenarios WHERE category = ?";
  $stmt = $conn->prepare($sql);
  $stmt->bind_param('i', $category);
  $stmt->execute();
  $result = $stmt->get_result();
  while ($row = $result->fetch_array(MYSQLI_ASSOC))
  {
    $tempArray[] = $row;
  }
}

echo json_encode($tempArray);
 ?>
