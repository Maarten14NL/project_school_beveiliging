<?php
function dump($str, $show = "active ", $framework = "bootstrap"){
    $bt = debug_backtrace();
    $caller = array_shift($bt);
    $tokens = explode('\\', $caller['file']);
    $file = $tokens[count($tokens) - 2] . '/' . $tokens[count($tokens) - 1];
    $readFileStr = file($caller['file']);
    $lineStr = $readFileStr[$caller['line'] -1];
    $regularOutput = preg_match('/\((.*?)\)/', $lineStr, $output);
    $variableName = str_replace([", 1", ",1", '""', ", "], "", $output[1]);
    $random_digit = mt_rand(10000000, 99999999);
    switch ($framework) {
      case 'bootstrap':
        echo '<button class="btn btn-light" data-toggle="collapse" data-target="#' . $random_digit . '">' .$variableName . '</button>';
        echo "<div class='collapse " . $show ."' id='" . $random_digit . "'>";
        echo "var '<strong>" . $variableName . "</strong>' dumped in file: <strong>" . $file . '</strong> on line: <strong>' . $caller['line'] . '</strong><br>';
        echo '<pre>' . var_export($str, true) . '</pre>';
        echo "</div>";
        break;
      case 'materialize':
          echo '<ul class="collapsible">';
          echo '  <li class="' . $show . '">';
          echo '    <div class="collapsible-header">' .$variableName .'</div>';
          echo '    <div class="collapsible-body">';
          echo "var '<strong>" . $variableName . "</strong>' dumped in file: <strong>" . $file . '</strong> on line: <strong>' . $caller['line'] . '</strong><br>';
          echo '      <pre>' . var_export($str, true) . '</pre>';
          echo '    </div>';
          echo '  </li>';
          echo '</ul>';
        break;
      default:

        break;
    }
}

?>
