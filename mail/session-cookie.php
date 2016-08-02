<?php
/**
 * File Sets a Session Cookie for Spam Protection
 *
 * @author Sam Thilmany
 * @copyright 2016
 */

// Set the Timezone
date_default_timezone_set("Europe/Berlin");

// Set a Session ID
$value = uniqid( time() );

// Set the Session Cookie
session_start();
$_SESSION["spam1"] = $value;

echo $value;
?>
