<?php
if (isset($_POST['logout'])) {
    resetSession();
}
if (isset($_POST['loginSub'])) {
    $name = $_POST['username'];
    $pass = $_POST['password'];

    $sql = 'SELECT id FROM users WHERE username = ? AND password = ?';
    $stmt = $con->prepare($sql);
    $stmt->bind_param("ss", $name, $pass);
    $stmt->execute();
    $stmt->store_result();
    $stmt->bind_result($idResult);
    if ($stmt->num_rows == 1) {
        if($stmt->fetch()) {
            setSession($idResult, $name, $pass);
        }
        else{
            resetSession();
        }
    }
    $stmt->close();
}
?>
