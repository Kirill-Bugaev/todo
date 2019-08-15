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

$query = "DELETE FROM $table WHERE id='$id';";
$result = $dbconn->query($query);
check_query_result($dbconn, $result);

$dbconn->close();

echo <<<_END
<?xml version="1.0" encoding="UTF-8"?>
<xml>
</xml>
_END;

?>
