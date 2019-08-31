<?php

require_once 'login.php';
require_once 'config.php';
require_once 'routine.php';

header('Content-Type: text/xml');

$dbconn = db_connect($hostname, $username, $password, $database);

$query = "SELECT * FROM $table ORDER BY id";
$result = $dbconn->query($query);
check_query_result($dbconn, $result);

echo '<?xml version="1.0" encoding="UTF-8"?>';
echo "<xml>";
$rows = $result->num_rows;
for ($i = 0; $i < $rows; $i++) {
	$row = $result->fetch_array(MYSQLI_ASSOC);
	echo '<task'
	 	. ' id="'			. $row['id'] 		. '"'
	 	. ' date="'		. $row['date']	. '"'
		. ' color="'	. $row['color']	. '"'
		. ' done="'		. $row['done']	. '"'
		. '>' 				. htmlentities($row['text'])
		. '</task>';
}
echo "</xml>";

$result->close();
$dbconn->close();

?>
