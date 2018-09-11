<?php
include 'database.php';
$id = $_POST['activeid'];
$finished = $_POST['finished'];
$alerted = $_POST['alerted'];
if ($finished == 1 && $alerted == 1) {
    $sql = "DELETE FROM active_scenarios WHERE id=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $stmt->close();
    echo "1";
}
else{
    $sql = "UPDATE active_scenarios SET finished = ?, alerted = ? WHERE id=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('iii', $finished, $alerted, $id);
    $stmt->execute();
    $stmt->close();
}
echo 'success';
?>
