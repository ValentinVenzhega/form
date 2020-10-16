<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'phphmailer/src/Exception.php';
require 'phphmailer/src/phpMailer.php';

$mail = new phpMailer(true);
$mail->CharSet = 'UTF-8';
$mail->setLanguage('ru', 'phpmailer/language/');
$mail->IsHTML(true);

//От кого пиьсмо
$mail -> setFrom('info@fls.guru', 'фрилансер по жизни');
// кому отправить
$mail -> addAdress('code@fls.guru');
// тема письма
$mail -> Subject = 'Привет! Это  'фрилансер по жизни'';

//рука
$hand = 'Правая';
if($_POST['hand'] == 'left') {
   $hand = 'Левша';
}

//тело письма

$body = '<h1> Встречайте супер письмо </h1>';

if (trim(!empty($_POST['name']))) {
   $body.='<p><strong>Имя:</strong></p> '.$_POST['name'].'</p>';
}
if (trim(!empty($_POST['email']))) {
   $body.='<p><strong>E-mail:</strong></p> '.$_POST['email'].'</p>';
}
if (trim(!empty($_POST['hand']))) {
   $body.='<p><strong>Рука:</strong></p> '.$hand.'</p>';
}
if (trim(!empty($_POST['age']))) {
   $body.='<p><strong>Возраст:</strong></p> '.$_POST['age'].'</p>';
}
if (trim(!empty($_POST['message']))) {
   $body.='<p><strong>Сообщение</strong></p> '.$_POST['message'].'</p>';
}

// Прикрепить файл
if (!empty($_FILES['image']['tmp_name'])) {
   //путь загрузки файла
   $filePath = __DIR__ . "/files/" . $_FILES['image']['name'];
   //загрузка файла
   if (copy($_FILES['image']['tmp_name'], $filePath)) {
      $fileAttach = $filePath;
      $body.='<p><strong>фото в приложении</strong></p>';
      $mail->addAttachment($fileAttach);
   }
}

$mail->Body = $body;

//Отправляем

if (!$mail->send()) {
   $message = 'Ошибка';
} else {
   $message = 'Данные отправлены!';
}

$response = ['message' => $message];

header('Content-type: application/json');
echo json_encode($response);

?>