<?php

require_once 'login.php';
require_once 'config.php';
require_once 'routine.php';

header('Content-Type: text/xml');

$dbconn = db_connect($hostname, $username, $password, $database);

if (isset($_POST['id']))
	$id = mysqli_real_escape_string($dbconn, $_POST['id']);
else
	xml_die("Task id should be specified");

$query = "UPDATE $table SET ";
$only_item = 1;
if (isset($_POST['text'])) {
	$text = mysqli_real_escape_string($dbconn, $_POST['text']);
	if (strlen($text) > $max_text_length)
		xml_die("Task text too long (max $max_text_length)");
	if (!$only_item)
		$query .= ", ";
	$query .= "text='$text'";
	$only_item = 0;
}
if (isset($_POST['color'])) {
	$color = mysqli_real_escape_string($dbconn, $_POST['color']);
	if (!$only_item)
		$query .= ", ";
	$query .= "color='$color'";
	$only_item = 0;
}
if (isset($_POST['done'])) {
	$done = mysqli_real_escape_string($dbconn, $_POST['done']);
	if (!$only_item)
		$query .= ", ";
	$query .= "done='$done'";
	$only_item = 0;
}
$query .= " WHERE id='$id';";

$result = $dbconn->query($query);
check_query_result($dbconn, $result);

$dbconn->close();

echo <<<_END
<?xml version="1.0" encoding="UTF-8"?>
<xml>
</xml>
_END;

?>
