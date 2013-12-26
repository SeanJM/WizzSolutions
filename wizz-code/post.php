<?php
session_start();
$sender = $_GET['name'];
$return = $_GET['email'];
$message = $_GET['message'];
$serverno = $_GET['serversnumber'];
$budget = $_GET['budget'];
$hosting = $_GET['hosting'];


//$to = "mike@wizzsolutions.com";
$to = "mkahnucf@gmail.com";
$subject = "Message from ". strip_tags($sender);

$headers = "From: " . strip_tags($sender) . "\r\n";
$headers .= "Reply-To: ". strip_tags($return) . "\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";


$msg = "<html><body>";
$msg .= "<h2 style='font-weight:bold;border-bottom:1px solid #bbb;'>New Contact Message</h2>\r\n";
$msg .= "Sent by: <strong>".$sender."</strong><br />\r\n";
$msg .= "Respond to: <strong>".$return."</strong><br /><br />\r\n";
$msg .= "Message: <br />\r\n";
$msg .= "<em>".$message."</em><br />\r\n";
$msg .= "Requirement: <br />\r\n";
$msg .= "<em> No of Servers".$serverno."</em><em> budget:".$budget."</em><em> hosting:".$hosting."</em><br />\r\n";

$msg .= "</body></html>";


if($_REQUEST['captchanumber'] == $_REQUEST['answer'])
	{
		
		// insert your name , email and text message to your table in db 
		@mail($to, $subject, $msg, $headers);
		echo 1;// submitted 
		
	}
	else
	{
		echo 0; // invalid code
	}
	?>

