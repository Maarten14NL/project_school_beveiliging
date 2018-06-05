<?php
  include 'database.php';

  $id = $_POST['id'];

  // $temp =   "DELETE FROM `active_scenarios` WHERE `scenarios_id`=$id"
  // $review = "DELETE FROM `scenario_descriptions` WHERE `scenarios_id`=$id";
  // $delete = "DELETE FROM `scenarios` WHERE `id`=$id";

  $id = $_POST['id'];
  $sql = "DELETE FROM `active_scenarios` WHERE `scenarios_id`=?";
  $stmt = $conn->prepare($sql);
  $stmt->bind_param("i", $id);
  $result = $stmt->execute();
  if ($result) {
      echo 'succes';
  }

  $id = $_POST['id'];
  $sql = "DELETE FROM `scenario_descriptions` WHERE `scenarios_id`=?";
  $stmt = $conn->prepare($sql);
  $stmt->bind_param("i", $id);
  $result = $stmt->execute();
  if ($result) {
      echo 'succes';
  }

  $id = $_POST['id'];
  $sql = "DELETE FROM `scenarios` WHERE `id`=?";
  $stmt = $conn->prepare($sql);
  $stmt->bind_param("i", $id);
  $result = $stmt->execute();
  if ($result) {
      echo 'succes';
  }
 ?>
