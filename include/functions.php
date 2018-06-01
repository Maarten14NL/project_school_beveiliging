<?php
function dump($str, $jslog = 0, $jsdel = 0){
    $bt = debug_backtrace();
    $caller = array_shift($bt);
    $tokens = explode('\\', $caller['file']);
    $file = $tokens[count($tokens) - 2] . '/' . $tokens[count($tokens) - 1];
    $readFileStr = file($caller['file']);
    $lineStr = $readFileStr[$caller['line'] -1];
    $regularOutput = preg_match('/\((.*?)\)/', $lineStr, $output);
    $variableName = str_replace([", 1", ",1"], "", $output[1]);
    $extraStr = "";
    if ($jsdel) {
        $extraStr = "js-delete-this-log";
    }
    echo $jslog ? "<div class='js-log " . $extraStr . "'>" : "<div>";
    echo "var '<strong>" . $variableName . "</strong>' dumped in file: <strong>" . $file . '</strong> on line: <strong>' . $caller['line'] . '</strong><br>';
    echo '<pre>' . var_export($str, true) . '</pre>';
    echo "</div>";
}
?>
