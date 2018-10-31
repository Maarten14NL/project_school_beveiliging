<?php
  include 'database.php';
  $finished = $_POST['finished'];
  $alerted = $_POST['alerted'];
  $active_scenarios = [];
  $sql = "SELECT scenarios.id as scenario_id, scenarios.sound as sound, active_scenarios.sound as soundActive, active_scenarios.id as active_id, active_scenarios.location, active_scenarios.finished, active_scenarios.alerted, active_scenarios.tools, scenarios.name FROM active_scenarios
    INNER JOIN scenarios ON active_scenarios.scenarios_id = scenarios.id  WHERE finished = ? AND alerted = ?";
  $stmt = $conn->prepare($sql);
  $stmt->bind_param('ii', $finished, $alerted);
  $stmt->execute();
  $result = $stmt->get_result();
  while ($row = $result->fetch_array(MYSQLI_ASSOC))
  {
      $row['steps'] = [];
      $tempid = $row['scenario_id'];
      $sql2 = "SELECT * FROM scenario_descriptions WHERE scenarios_id = ?";
      $stmt2 = $conn->prepare($sql2);
      $stmt2->bind_param('i', $tempid);
      $stmt2->execute();
      $result2 = $stmt2->get_result();
      while ($row2 = $result2->fetch_array(MYSQLI_ASSOC))
      {
          $row['steps'][] = $row2;
      }

      $active_scenarios[] = $row;
  }

  echo json_encode($active_scenarios);
 ?>
