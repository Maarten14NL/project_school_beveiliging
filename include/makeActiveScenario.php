<?php
include 'database.php';
$lokaal = $_POST['lokaalnr'];
$scenario_id = $_POST['scenarioId'];
$tools = $_POST['tools'];

$sql = "INSERT INTO `active_scenarios`(`location`, `scenarios_id`, `tools`) VALUES (?,?,?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param('sii', $lokaal, $scenario_id, $tools);
$stmt->execute();
$stmt->close();
echo 'success';
?>
