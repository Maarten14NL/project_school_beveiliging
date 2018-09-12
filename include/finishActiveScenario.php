<?php
include 'database.php';
$id = $_POST['activeid'];
if (isset($_POST['del'])) {
    $sql = "DELETE FROM active_scenarios WHERE id=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $stmt->close();
    echo "1";
}
else{
    $finished = $_POST['finished'];
    $alerted = $_POST['alerted'];
    $sql = "UPDATE active_scenarios SET finished = ?, alerted = ? WHERE id=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('iii', $finished, $alerted, $id);
    $stmt->execute();
    $stmt->close();
}
echo 'success';
?>
