<?php
include 'database.php';
$lokaal = $_POST['lokaalnr'];
$scenario_id = $_POST['scenarioId'];
$tools = $_POST['tools'];
$sound = $_POST['sound'];

$sql = "INSERT INTO `active_scenarios`(`location`, `scenarios_id`, `tools`, `sound`) VALUES (?,?,?,?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param('siii', $lokaal, $scenario_id, $tools, $sound);
$stmt->execute();
$stmt->close();
echo 'success';
?>
