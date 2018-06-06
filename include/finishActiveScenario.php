<?php
include 'database.php';
$id = $_POST['activeid'];
$finished = $_POST['finished'];
$alerted = $_POST['alerted'];
$sql = "UPDATE active_scenarios SET finished = ?, alerted = ? WHERE id=?";
$stmt = $conn->prepare($sql);
$stmt->bind_param('iii', $finished, $alerted, $id);
$stmt->execute();
$stmt->close();
echo 'success';
?>
