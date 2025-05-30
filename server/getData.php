<?php
// Permitir solicitudes desde tu dominio específico (Netlify)
header("Access-Control-Allow-Origin: https://certificado-masgps.netlify.app");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

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

    $patente = $conn->real_escape_string($input['patente']);

    // Primera consulta a la tabla LpfPullmanInfoView
    $query = "SELECT * FROM masgps.LpfPullmanInfoView WHERE patente = '$patente'";
    $result = $conn->query($query);

    if ($result && $result->num_rows > 0) {
        // Si se encuentra información en la primera tabla
        $data = $result->fetch_assoc();
        echo json_encode($data);
    } else {
        // Si no se encuentra información, buscar en la segunda tabla LpfExternosView
        $query2 = "SELECT * FROM masgps.lpfExternosView WHERE patente = '$patente'";
        $result2 = $conn->query($query2);

        if ($result2 && $result2->num_rows > 0) {
            // Si se encuentra información en la segunda tabla
            $data = $result2->fetch_assoc();
            echo json_encode($data);
        } else {
            // Si no se encuentra información en ninguna tabla
            http_response_code(404);
            echo json_encode(['error' => 'Vehículo no encontrado']);
        }
        $result2->free();
    }

    // Liberar el resultado de la primera consulta
    $result->free();
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
}

// Cerrar la conexión
$conn->close();
?>

