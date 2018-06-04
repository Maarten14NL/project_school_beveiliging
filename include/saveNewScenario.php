<?php
include 'database.php';
$name = $_POST['name'];
$steps= $_POST['steps'];
$sql = 'INSERT INTO scenarios (name) VALUES (?);';
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $name);
$stmt->execute();
$scenario_id = $stmt->insert_id;
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
