<?php

include './config.php';
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

// Obtener los datos JSON del cuerpo de la petición
$data = json_decode(file_get_contents('php://input'), true);

// Extraer los datos del JSON
$patente = $data['patente'];
$codigo = $data['codigo'];
$fechaHora = $data['fechaHora'];

// Insertar datos en la tabla 'folios'
$sql = "INSERT INTO folios (patente, codigo, fechaHora) VALUES ('$patente', '$codigo', '$fechaHora')";

if ($conn->query($sql) === TRUE) {
    // Obtener el ID del registro recién insertado con el código especificado
    $sql = "SELECT id FROM folios WHERE codigo = '$codigo'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $id = $row['id'];
        echo json_encode(['status' => 'success', 'id' => $id]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'No se encontró el código']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => $conn->error]);
}

$conn->close();