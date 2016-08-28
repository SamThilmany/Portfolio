<?php
/**
 * File Validates the Submitted Data and Sends the Mail
 *
 * @author Sam Thilmany
 * @copyright 2016
 *
 */

require_once 'debug.php';


/**
 * Set timezone
 *
 */
date_default_timezone_set("Europe/Berlin");




/**
 * Start a session
 *
 */
session_start();




/**
 * Import the Private Variables
 *
 */
require 'configure.php';




/**
 * Set the value from the form into variables
 *
 * @var [string]
 *
 */
$name_user        =   htmlspecialchars($_POST['name']);
$address_user     =   htmlspecialchars($_POST['email']);
$subject          =   htmlspecialchars($_POST['subject']);
$message          =   htmlspecialchars($_POST['message']);
$spam1            =   htmlspecialchars($_POST['spam1']);
$spam2            =   htmlspecialchars($_POST['spam2']);
$session_spam     =   htmlspecialchars($_SESSION["spam1"]);

list($first_name, $last_name)    =   explode(' ', $name_user);




/**
 * Validation of the submitted data
 *
 * @var [boolean]
 *
 */
$cont_name    = preg_match("/[^\p{L}\s]/u", $name_user);
$cont_email   = !filter_var($address_user, FILTER_VALIDATE_EMAIL);
$cont_subject = empty($subject);
$cont_message = empty($message);
$cont_spam1   = ($spam1 == $session_spam) ? false : true;
$cont_spam2   = ($spam2 == "") ? false : true;




/**
 * Check the validated variables and store the result in an array
 *
 * @var [boolean]
 *
 * @return [boolean]
 *
 */
if ($cont_name === true || empty($name_user)) {
  $error['data_validation_name'] = true;
}
else {
  $error['data_validation_name'] = false;
}
if ($cont_email === true) {
  $error['data_validation_email'] = true;
}
else {
  $error['data_validation_email'] = false;
}
if ($cont_subject === true) {
  $error['data_validation_subject'] = true;
}
else {
  $error['data_validation_subject'] = false;
}
if ($cont_message === true) {
  $error['data_validation_message'] = true;
}
else {
  $error['data_validation_message'] = false;
}
if ($cont_spam1 === true) {
  $error['data_validation_spam1'] = true;
}
else {
  $error['data_validation_spam1'] = false;
}
if ($cont_spam2 === true) {
  $error['data_validation_spam2'] = true;
}
else {
  $error['data_validation_spam2'] = false;
}




/**
 * Check if the array contains any errors
 *
 * @var [boolean]
 *
 * @return [boolean]
 *
 */
$errorFound = false;
foreach($error as $key => $value)
{
  if($value === true)
  {
    $errorFound = true;
    $error['send'] = true;
    break;
  }
}




/**
 * If no error was found, send the message to the admin and to the user
 *
 * @var [boolean]
 *
 */
if(!$errorFound) {

  /**
   * Import PHPMailer
   *
   */
  require('../vendor/phpmailer/PHPMailerAutoload.php');


  /**
   * Set up some variables for the mail contents
   *
   */
  $values = array(
    'first_name' 	=>	htmlspecialchars_decode($first_name),
    'last_name'	 	=>	htmlspecialchars_decode($last_name),
    'email'				=>	htmlspecialchars_decode($address_user),
    'subject' 		=>	stripslashes(htmlspecialchars_decode($subject)),
    'message'			=>	stripslashes(htmlspecialchars_decode($message)),
    'date'				=>	date("d.m.Y", time()),
    'time'				=>	date("H:i", time()),
    'year'				=>	date("Y"),
    'url_raleway' =>  $url . '/Raleway-Regular.ttf',
    'url_guicks'  =>  $url . '/Quicksand-Regular.otf'
  );
  $replace = array();
  foreach ($values as $key => $value) {
    $replace['{' . $key . '}'] = nl2br(htmlentities($value));
  }


  /**
   * Set up the HTML mail body for the admin
   *
   */
  $mailTemplate_admin	= file_get_contents('templates/mail_admin.html');
  $mailContent_admin	= strtr($mailTemplate_admin, $replace);


  /**
   * Send email to the website admin
   *
   */
  $mail_admin = new PHPMailer();

  $mail_admin->CharSet    = 'UTF-8';
  $mail_admin->From       = htmlspecialchars_decode($address_user);
  $mail_admin->FromName   = $name_user;
  $mail_admin->AddAddress($address_owner, $name_owner);
  $mail_admin->IsHTML(true);
  $mail_admin->Subject    = $subject;
  $mail_admin->Body       = $mailContent_admin;
  $mail_admin->AltBody    = strip_tags($message);


  /**
   * If mail to the website admin was sent successfully,
   * send it to the website user
   *
   * @return [boolean]
   *
   */
  if($mail_admin->Send()) {
    $error['send_admin'] = false;


    /**
     * Set up the HTML mail body for the user
     *
     */
     $mailTemplate_user 	= file_get_contents('templates/mail_user.html');
     $mailContent_user		= strtr($mailTemplate_user, $replace);


    /**
     * Send email to the website user
     *
     */
    $mail_user = new PHPMailer();

    $mail_user->CharSet   = 'UTF-8';
    $mail_user->From      = $address_owner;
    $mail_user->FromName  = $name_owner;
    $mail_user->AddAddress($address_user, $name_user);
    $mail_user->IsHTML(true);
    $mail_user->Subject   = 'Your message "' . $subject . '" has reached me';
    $mail_user->Body      = $mailContent_user;
    $mail_user->AltBody   = strip_tags($message);


    /**
     * If mail to the website user was sent successfully
     *
     */
    if($mail_user->Send()) {
      $error['send_user'] = false;
    }


    /**
     * If mail to the website user was not sent successfully
     *
     */
    else {
      $error['send_admin'] = true;
    }


  }


  /**
   * If mail to the website admin was not sent successfully
   *
   */
  else {
    $error['send_admin'] = true;
  }


}




/**
 * Encode the $return Array to a json String
 *
 * @return  [JSON string]
 *
 */
echo json_encode($error);




/**
 * Destroy the Session Cookies
 *
 */
session_unset();
session_destroy();

?>
