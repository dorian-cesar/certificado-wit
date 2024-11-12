<?php
// Permitir solicitudes desde tu dominio específico (Netlify)
header("Access-Control-Allow-Origin: https://certificado-masgps.netlify.app");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
//*
// Manejar la solicitud preflight (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header("HTTP/1.1 204 No Content");
    exit;
}
require '../vendor/autoload.php'; // Carga las dependencias

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use Dotenv\Dotenv;

// Cargar variables de entorno desde el archivo .env
$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

// Configuración del servidor SMTP desde las variables de entorno

$smtpHost = $_ENV['MAIL_HOST'];
$smtpPort = $_ENV['MAIL_PORT'];
$smtpUser = $_ENV['MAIL_USERNAME'];
$smtpPass = $_ENV['MAIL_PASSWORD'];
$fromName = $_ENV['MAIL_FROM_NAME'];


$data = json_decode(file_get_contents('php://input'), true);

// Extraer los datos del JSON

$correo = $data['correo'];
$contenido = $data['contenido'];



// Verifica que el correo destinatario haya sido enviado por POST
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($correo)) {
    echo
    $correoDestinatario = $data['correo'];

        // Crea un archivo temporal para almacenar el contenido HTML
        $tempFilePath = 'temp_file.html';
        file_put_contents($tempFilePath, $contenido);

    $mail = new PHPMailer(true);

    try {
        // Configuración del servidor
        $mail->isSMTP();
        $mail->Host = $smtpHost;
        $mail->SMTPAuth = true;
        $mail->Username = $smtpUser;
        $mail->Password = $smtpPass;
        $mail->SMTPSecure ='tls';
        $mail->Port = 587;

        // Configuración del remitente y destinatario
        $mail->setFrom($smtpUser, $fromName);
        $mail->addAddress($correoDestinatario);

        // Contenido del correo
        $mail->isHTML(true);
        $mail->Subject = 'Asunto del correo';
        $mail->Body = 'Se adjunta el certificado en formato HTML.'; // Mensaje en el cuerpo del correo

         // Adjuntar el archivo HTML
         $mail->addAttachment($tempFilePath, 'certificado.html'); // Agrega el archivo adjunto

        // Enviar el correo
        $mail->send();
        echo 'Correo enviado exitosamente';
    } catch (Exception $e) {
        echo "El correo no pudo ser enviado. Error: {$mail->ErrorInfo}";
    }
} else {
    echo 'Por favor, proporciona un correo en el campo "correo".';
}
?>
