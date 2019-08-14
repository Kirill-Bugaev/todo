<?php

function xml_die($msg) {
	echo '<?xml version="1.0" encoding="UTF-8"?>';
	echo "<xml>";
	echo "<error>$msg</error>";
	echo "</xml>";
	die();
}

function db_connect($hn, $un, $pw, $db) {
	$dbconn = new mysqli($hn, $un, $pw, $db);
	if ($dbconn->connect_error) {
		xml_die($dbconn->error);
	}
	return $dbconn;
}

function check_query_result($dbconn, $result) {
	if (!$result) {
		xml_die($dbconn->error);
	}
}

?>
