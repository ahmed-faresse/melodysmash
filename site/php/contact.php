<?php

$myemail = "ahmed.faresse@gmail.com";


$name = check_input($_POST['inputName']);
$email = check_input($_POST['inputEmail']);
$subject = check_input($_POST['inputSubject']);
$message = check_input($_POST['inputMessage']);

/* If e-mail is not valid show error message */
if (!preg_match("/([\w\-]+\@[\w\-]+\.[\w\-]+)/", $email))
{
echo "Please put a valid email adress !";
exit();
}
/* Let's prepare the message for the e-mail */

$subject = "Someone has sent you a message";

$message = "

Someone has sent you a message using your contac form:

Name: $name
Email: $email
Subject: $subject

Message:
$message

";


mail($myemail, $subject, $message);
header('Location: contact-success.html');
exit();

/* Functions we used */
function check_input($data)
{
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
return $data;
}

?>