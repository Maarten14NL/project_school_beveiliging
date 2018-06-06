<?php
include 'database.php';

$name = $_POST['username'];
$password = sha1($_POST['userpassword']);
$level = $_POST['userlevel'];

$sql = "INSERT INTO `users` (`username`, `password`, `userlevel`) VALUES (?,?,?);";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssi", $name, $password, $level);
$stmt->execute();
echo 'success';

// if (mysqli_query($conn, $insert)) {
//   echo " succes";
// } else {
//   echo " Error: " . $insert . "<br>" . mysqli_error($conn);
// }
 ?>
