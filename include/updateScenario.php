<?php
include 'database.php';
echo json_encode($_POST);
$scenario_id = $_POST['scenarioID'];
$name = $_POST['name'];
$steps = $_POST['descriptions'];
$details = $_POST["details"];
$sound = $_POST['sound'];
// echo "name: " . $name . " scneario: " . $scenario_id . "<br>";

$sql = "UPDATE `scenarios` SET `name`=?, `sound` =? WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param('ssi',$name, $sound, $scenario_id);
$stmt->execute();
// $scenario_id = $stmt->insert_id;
$stmt->close();

$sql = "DELETE FROM `scenario_descriptions` WHERE `scenarios_id`=?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $scenario_id);
$stmt->execute();
$stmt->close();

$name = '';
$sql = 'INSERT INTO scenario_descriptions (description, detail, scenarios_id) VALUES (?, ?);';
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssi", $name, $detial, $scenario_id);
foreach ($steps as $key => $value) {
    $name = $value;
    $detail = $details[$key];
    $stmt->execute();
}
$stmt->close();

echo "succes";
?>
