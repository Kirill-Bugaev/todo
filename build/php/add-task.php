<?php

require_once 'login.php';
require_once 'routine.php';

header('Content-Type: text/xml');

$dbconn = db_connect($hostname, $username, $password, $database);
 
if (!isset($_POST['text'])
		|| strlen($text = mysqli_real_escape_string($dbconn, trim($_POST['text']))) == 0)
	xml_die("Task text is empty");
if (isset($_POST['color']))
	$color = mysqli_real_escape_string($dbconn, $_POST['color']);
else
	$color = 0;
if (isset($_POST['done']))
	$done = mysqli_real_escape_string($dbconn, $_POST['done']);
else
	$done = 0;

$query = "INSERT INTO todo(text, color, done) VALUES('$text', '$color', '$done');";
$result = $dbconn->query($query);
check_query_result($dbconn, $result);

$id = $dbconn->insert_id;
$query = "SELECT date FROM todo WHERE id='$id';";
$result = $dbconn->query($query);
if (!$result)
	$date = 0;
else
	$date = $result->fetch_array(MYSQLI_NUM)[0];
$result->close();

$dbconn->close();

echo <<<_END
<?xml version="1.0" encoding="UTF-8"?>
<xml>
	<task id="$id" date="$date"></task>
</xml>
_END

?>
