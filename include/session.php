<?php
session_start();
include 'database.php'; // Should create a var $con

// If this variable doesn't exist, it creates all the session vars
if (!isset($_SESSION['loggedIn'])) {
    resetSession();
}

$loggedIn = $_SESSION['loggedIn'];
if ($loggedIn) {
    $id = $_SESSION['userID'];

    $sql = 'SELECT username, password FROM users WHERE id=?';
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $stmt->bind_result($name, $pass);

    $userinfo = [];
    // If the query doesn't return anything it'll reset the session
    if($stmt->fetch()) {
        $userinfo = array('name'=>$name, 'pass'=>$pass);
    }
    else{
        resetSession();
    }
    $stmt->close();
    // If the returned values isn't the same as the session values it resets
    if ($_SESSION['username']  != $userinfo['name'] || $_SESSION['password'] != $userinfo['pass']) {
        resetSession();
    }
    unset($userinfo, $smtp, $sql);
    $loggedIn = 0;
}
else {
    // header('Location:index.php');
}
// The reset
function resetSession(){
    $_SESSION = [];
    $_SESSION['loggedIn'] = 0;
    $_SESSION['userID'] = 0;
    $_SESSION['username'] = '';
    $_SESSION['password'] = '';
    $_SESSION['level'] = 0;
    $_SESSION['flashMessage'] = [
        'message' => '',
        'type' => ''
    ];
}

function clearFlashMessage(){
    $_SESSION['flashMessage'] = [
        'message' => '',
        'type' => ''
    ];
}

function setFlashMessage($mes, $type){
    $_SESSION['flashMessage'] = [
        'message' => $mes,
        'type' => $type
    ];
}

function setSession($id, $usn, $pass, $lvl){
    resetSession();
    $_SESSION['loggedIn'] = 1;
    $_SESSION['userID'] = $id;
    $_SESSION['username'] = $usn;
    $_SESSION['password'] = $pass;
    $_SESSION['level'] = $lvl;
}


// Debug reset
function resetSessionDebug(){
    $_SESSION['loggedIn'] = 1;
    $_SESSION['userID'] = 1;
    $_SESSION['username'] = 'dylanbos';
    $_SESSION['password'] = 'hallo';
}
?>
