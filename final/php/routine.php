<?php

require_once 'config.php';

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
		xml_die("MySQL connection error. " . $dbconn->connect_error);
	}
	return $dbconn;
}

function check_query_result($dbconn, $result) {
	if (!$result) {
		xml_die($dbconn->error);
	}
}

function check_table_exists($dbconn, $table) {
	return $dbconn->query("SHOW TABLES LIKE '".$table."'")->num_rows;
}

function create_todo_table($dbconn, $table) {
	return $dbconn->query("CREATE TABLE $table (
		id INT UNSIGNED NOT NULL AUTO_INCREMENT KEY,
		date TIMESTAMP,
		text TEXT($max_text_length),
		color TINYINT UNSIGNED,
		done TINYINT UNSIGNED)
		ENGINE InnoDB;");
}

?>
