<?php
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

// Verifica que el correo destinatario haya sido enviado por POST
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['correo'])) {
    $correoDestinatario = $_POST['correo'];

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
        $mail->Body    = 'Este es el cuerpo del correo de prueba.';

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
