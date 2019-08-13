<?php

require_once 'login.php';

header('Content-Type: text/xml');
echo '<?xml version="1.0" encoding="UTF-8"?>';
echo "<xml>";

$dbconn = new mysqli($hn, $un, $pw, $db);
if ($dbconn->connect_error) {
	echo "<error>$dbconn->error</error>";
	echo "</xml>";
	exit(0);
}

$query = "SELECT * FROM todo ORDER BY id";
$result = $dbconn->query($query);
if (!$result) {
	echo "<error>$dbconn->error</error>";
	echo "</xml>";
	exit(0);
}

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

$result->close();
$dbconn->close();

echo "</xml>";

?>
