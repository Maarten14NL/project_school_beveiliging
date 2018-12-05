<?php
// session_start();
// include 'database.php'; // Should create a var $con
//
// // If this variable doesn't exist, it creates all the session vars
// if (!isset($_SESSION['loggedIn'])) {
//     resetSession();
// }
//
// $loggedIn = $_SESSION['loggedIn'];
// if ($loggedIn) {
//     $id = $_SESSION['userID'];
//
//     $sql = 'SELECT username, password FROM users WHERE id=?';
//     $stmt = $conn->prepare($sql);
//     $stmt->bind_param("i", $id);
//     $stmt->execute();
//     $stmt->bind_result($name, $pass);
//
//     $userinfo = [];
//     // If the query doesn't return anything it'll reset the session
//     if($stmt->fetch()) {
//         $userinfo = array('name'=>$name, 'pass'=>$pass);
//     }
//     else{
//         resetSession();
//     }
//     $stmt->close();
//     // If the returned values isn't the same as the session values it resets
//     if ($_SESSION['username']  != $userinfo['name'] || $_SESSION['password'] != $userinfo['pass']) {
//         resetSession();
//     }
//     unset($userinfo, $smtp, $sql);
//     $loggedIn = 0;
// }
// else {
//     // header('Location:index.php');
// }
// // The reset
// function resetSession(){
//     $_SESSION = [];
//     $_SESSION['loggedIn'] = 0;
//     $_SESSION['userID'] = 0;
//     $_SESSION['username'] = '';
//     $_SESSION['password'] = '';
//     $_SESSION['level'] = 0;
//     $_SESSION['flashMessage'] = [
//         'message' => '',
//         'type' => ''
//     ];
// }
//
// function clearFlashMessage(){
//     $_SESSION['flashMessage'] = [
//         'message' => '',
//         'type' => ''
//     ];
// }
//
// function setFlashMessage($mes, $type){
//     $_SESSION['flashMessage'] = [
//         'message' => $mes,
//         'type' => $type
//     ];
// }
//
// function setSession($id, $usn, $pass, $lvl){
//     resetSession();
//     $_SESSION['loggedIn'] = 1;
//     $_SESSION['userID'] = $id;
//     $_SESSION['username'] = $usn;
//     $_SESSION['password'] = $pass;
//     $_SESSION['level'] = $lvl;
// }
//
//
// // Debug reset
// function resetSessionDebug(){
//     $_SESSION['loggedIn'] = 1;
//     $_SESSION['userID'] = 1;
//     $_SESSION['username'] = 'dylanbos';
//     $_SESSION['password'] = 'hallo';
// }
?>
<?php
session_start();
include 'database.php'; // Should create a var $conn
include 'functions.php';

$shouldBeInSession = [
  'loggedIn' => 0,
  'userId' => 0,
  'username' => '',
  'password' => '',
  'level' => 0,
  'flashMessage' => [
    'message' => '',
    'type' => ''
  ]
];

// Checks if all session variables exist, if not it resets the session to the default values
foreach ($shouldBeInSession as $key => $value) {
  if (!array_key_exists($key, $_SESSION)) {
    resetSession();
  }
}

if(isset($_POST["return"])){
  echo json_encode($_SESSION);
}

$loggedIn = $_SESSION['loggedIn'];
if ($loggedIn) {
  $id = $_SESSION['userId'];
  $sql = 'SELECT username, password FROM users WHERE id=?';
  $stmt = $conn->prepare($sql);
  $stmt->bind_param("i", $id);
  $stmt->execute();
  $stmt->bind_result($name, $pass);

  $userinfo = [];
  // If the query doesn't return anything it'll reset the session
  if($stmt->fetch()) {
    $userinfo = array('name'=>$name, 'pass'=>$pass);
    // If the returned values isn't the same as the session values it resets
    if ($_SESSION['username']  != $userinfo['name'] || $_SESSION['password'] != $userinfo['pass']) {
      resetSession();
    }
  }
  else{
    resetSession();
  }
  $stmt->close();

  unset($userinfo, $smtp, $sql);
}
// The reset
function resetSession(){
  global $shouldBeInSession;
  $_SESSION = [];
  foreach ($shouldBeInSession as $key => $value) {
    $_SESSION[$key] = $value;
  }
  // header("Location: index.php");
}

function setSession_revised(...$params){
  global $shouldBeInSession;
  if (!is_array($params[0])) {
    $shouldCount = count($shouldBeInSession);
    $paramCount = count($params);
    if ($paramCount == $shouldCount) {
      $_SESSION = [];
      $keys = array_keys($shouldBeInSession);
      $newAr = array_combine($keys, $params);
      $_SESSION = $newAr;
    }
    else if ($paramCount < $shouldCount){
      $_SESSION = [];
      $numerical = array_values($shouldBeInSession);
      $keys = array_keys($shouldBeInSession);
      $values = [];
      for ($i=0; $i < $shouldCount; $i++) {
        if (isset($params[$i])) {
          array_push($values, $params[$i]);
        }
        else {
          array_push($values, $numerical[$i]);
        }
      }
      $newAr = array_combine($keys, $values);
      $_SESSION = $newAr;
    }
    else{
      return "too many params";
    }
  }
  else{
    $params = $params[0];
    foreach ($params as $key => $value) {
      $_SESSION[$key] = $value;
    }
  }
}
?>
