<?php
include 'database.php';
$scenario_id = $_POST['scenarioID'];
$name = $_POST['name'];
$steps = $_POST['descriptions'];
$details = $_POST["details"];
$sound = $_POST['sound'];
$category = $_POST['category'];
// echo "name: " . $name . " scneario: " . $scenario_id . "<br>";

$sql = "UPDATE `scenarios` SET `name`=?, `sound` =?, `category` = ? WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param('ssii', $name, $sound, $category, $scenario_id);
$stmt->execute();
// $scenario_id = $stmt->insert_id;
$stmt->close();

$sql = "DELETE FROM `scenario_descriptions` WHERE `scenarios_id`=?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $scenario_id);
$stmt->execute();
$stmt->close();

$name = '';
$sql = 'INSERT INTO scenario_descriptions (description, detail, scenarios_id) VALUES (?, ?, ?)';
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssi", $name, $detail, $scenario_id);
foreach ($steps as $key => $value) {
  echo $key;
    $name = $value;
    $detail = $details[$key];
    $stmt->execute();
}
$stmt->close();

echo "succes";
?>
