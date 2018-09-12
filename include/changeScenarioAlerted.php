<?php
include 'database.php';
$sql = "UPDATE active_scenarios SET alerted = 0 WHERE finished = 1 AND alerted = 1";
$stmt = $conn->prepare($sql);
$stmt->execute();
$stmt->close();
echo $sql;
?>
