<?php
include 'database.php';
$scenario_id = $_POST['scenarioID'];
$name = $_POST['name'];
$steps= $_POST['descriptions'];
echo "name: " . $name . " scneario: " . $scenario_id . "<br>";

$sql = "UPDATE `scenarios` SET `name`=? WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param('si',$name, $scenario_id);
$stmt->execute();
// $scenario_id = $stmt->insert_id;
$stmt->close();

$sql = "DELETE FROM `scenario_descriptions` WHERE `scenarios_id`=?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $scenario_id);
$stmt->execute();
// $scenario_id = $stmt->insert_id;
$stmt->close();

$name = '';
$sql = 'INSERT INTO scenario_descriptions (description, scenarios_id) VALUES (?, ?);';
$stmt = $conn->prepare($sql);
$stmt->bind_param("si", $name, $scenario_id);
foreach ($steps as $key => $value) {
    $name = $value;
    $stmt->execute();
}
$stmt->close();

echo "succes";
?>
