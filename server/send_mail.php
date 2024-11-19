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
require '../vendor/autoload.php';
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $pdfBase64 = $_POST['pdfBase64'];
    echo
    $email = $_POST['email']; // Recibir el correo del destinatario
    $pdfContent = explode(',', $pdfBase64)[1];
    $pdfFilePath = 'temp_pdf.pdf';

    file_put_contents($pdfFilePath, base64_decode($pdfContent));

    

    // Configurar PHPMailer
    $mail = new PHPMailer(true);
    try {


        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com'; // Cambia esto por tu servidor SMTP
        $mail->SMTPAuth = true;
        $mail->Username = 'mailer.wit@gmail.com'; // Cambia esto por tu correo electrónico rqcs ywcm suvh zyqt
        $mail->Password ='rqcsywcmsuvhzyqt' ;//'qzyuwykitiekjsku'; // Cambia esto por tu contraseña
        $mail->SMTPSecure = 'tls'; // O 'ssl' si es necesario
        $mail->Port = 587; // Puerto SMTP

        $mail->setFrom('tuCorreo@ejemplo.com', 'Wit-Certify');
        $mail->addAddress($email, 'Destinatario');

        $mail->isHTML(true);
        $mail->Subject = 'Certficado MasGPS by Wit.la';
        $mail->Body    = 'Adjunto Certificado en  formato pdf.';

        // Adjuntar PDF
        $mail->addAttachment($pdfFilePath, 'documento.pdf');

        $mail->send();
        echo 'Correo enviado correctamente.';
    } catch (Exception $e) {
        echo "Error al enviar correo: {$mail->ErrorInfo}";
    } finally {
        // Borrar el archivo temporal
      //  unlink($pdfFilePath);
    }
}
?>
