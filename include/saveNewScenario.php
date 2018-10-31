<?php
include 'database.php';


$name = $_POST['name'];
$steps= $_POST['steps'];
$sound = $_POST['sound'];
$details = $_POST['details'];

$sql = 'INSERT INTO scenarios (name, sound) VALUES (?,?);';
$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $name, $sound);
$stmt->execute();
$scenario_id = $stmt->insert_id;
$stmt->close();

$name = '';
$sql = 'INSERT INTO scenario_descriptions (description, scenarios_id, detail) VALUES (?, ?, ?);';
$stmt = $conn->prepare($sql);
$stmt->bind_param("sis", $name, $scenario_id, $detail);
foreach ($steps as $key => $value) {
    $name = $value;
    $detail = $details[$key];
    $stmt->execute();
}
$stmt->close();

echo "succes";
?>
