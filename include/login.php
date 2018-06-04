<?php
include 'session.php';
if (isset($_POST['logoutSub'])) {
    resetSession();
}
if (isset($_POST['loginSub'])) {
    $name = $_POST['username'];
    $pass = sha1($_POST['password']);
    $id = -1;
    $userlevel = -1;
    $sql = 'SELECT id, userlevel FROM users WHERE username = ? AND password = ?';
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $name, $pass);
    $stmt->execute();
    $result = $stmt->get_result();
    while ($row = $result->fetch_array(MYSQLI_ASSOC))
    {
        $id = $row['id'];
        $userlevel = $row['userlevel'];
    }
    if ($id != -1 && $userlevel != -1) {
        setSession($id, $name, $pass, $userlevel);
    }
    else{
        resetSession();
    }
    $stmt->close();
    echo json_encode($_SESSION);
}
?>
