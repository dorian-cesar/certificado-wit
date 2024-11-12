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

require './config.php';

// Verificar que la solicitud sea POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Decodificar el JSON del cuerpo de la solicitud
    $input = json_decode(file_get_contents('php://input'), true);

    // Validar que se haya enviado el valor de la patente
    if (!isset($input['patente']) || empty($input['patente'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Patente es requerida']);
        exit();
    }

    $patente = $input['patente'];
  

    // Preparar la consulta SQL
    $query = "SELECT * FROM masgps.LpfPullmanInfoView WHERE patente = '$patente'";

    // Ejecutar la consulta
    $result = $conn->query($query);

    // Verificar si se obtuvo algún resultado
    if ($result && $result->num_rows > 0) {
        // Obtener el resultado en un array asociativo
        $data = $result->fetch_assoc();
        
        // Devolver el resultado en formato JSON
        echo json_encode($data);
    } else {
        // Si no se encuentra el vehículo
        http_response_code(404);
        echo json_encode(['error' => 'Vehículo no encontrado']);
    }

    // Liberar el resultado
    $result->free();
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
}

// Cerrar la conexión
$conn->close();
?>

