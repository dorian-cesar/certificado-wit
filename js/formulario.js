$(document).ready(function () {
  const API_URL = "https://masgps-bi.wit.la/certificado-wit/server/getData.php";
  const ALERT_EMAIL = "mailto:soporte@wit.la?subject=Consulta%20Certificado";
  const DIAS_LIMITE = 3;

  // Cargar contenido inicial
  $("#alert").load("alerta.html");

  // Calcular diferencia en días entre dos fechas
  function calcularDiferenciaDias(fechaInicio, fechaFin) {
    const MS_POR_DIA = 24 * 60 * 60 * 1000; // Milisegundos en un día
    return Math.floor((fechaFin - fechaInicio) / MS_POR_DIA);
  }

  // Mostrar modal con mensaje personalizado
  function mostrarModalConAccion(mensaje, accion) {
    mostrarModal(mensaje, accion || function () {});
  }

  // Actualizar tabla con los datos del vehículo
  function actualizarTabla(datos) {
    const tbody = $("#vehiculoDatos");
    tbody.empty().append(`
      <tr>
        <td>${datos.patente}</td>
        <td>${datos.last_update}</td>
        <td>${datos.imei}</td>
        <td>${datos.Razon_Social}</td>
      </tr>
    `);
    $("#resultado").removeClass("d-none");
  }

  // Manejar envío del formulario
  $("#consultaForm").submit(function (event) {
    event.preventDefault();

    const patente = $("#patente").val();

    axios
      .post(API_URL, { patente })
      .then((response) => {
        const datosVehiculo = response.data;
        const fechaLastUpdate = new Date(datosVehiculo.last_update);
        const fechaActual = new Date();
        const diasDiferencia = calcularDiferenciaDias(fechaLastUpdate, fechaActual);

        if (diasDiferencia > DIAS_LIMITE) {
          const mensaje = `
            El vehículo está fuera de línea. Sin reportar hace ${diasDiferencia} días (${datosVehiculo.last_update}).
            Comuníquese con nuestra <a href="${ALERT_EMAIL}" target="_blank">área de soporte</a> para verificar el estado de operatividad del dispositivo.
          `;
          mostrarModalConAccion(mensaje);
          $("#resultado").addClass("d-none");
          return;
        }

        // Guardar datos seleccionados y en localStorage
        const selectedFeatures = $('input[name="features"]:checked').map((_, el) => $(el).val()).get();
        localStorage.setItem("featuresSelected", JSON.stringify(selectedFeatures));
        localStorage.setItem("vehiculoDatos", JSON.stringify(datosVehiculo));

        // Actualizar tabla con datos del vehículo
        actualizarTabla(datosVehiculo);
      })
      .catch((error) => {
        console.error("Error al consultar el vehículo:", error);
        alert("No se encontraron datos para la patente ingresada o ocurrió un error.");
      });
  });

  // Descargar certificado
  $("#descargarCertificado").click(function () {
    const mensaje = "Tu certificado se ha generado con éxito. Recuerda que tiene una vigencia de 1 año.";
    mostrarModalConAccion(mensaje, function () {
      window.open("hoja.html", "_blank");
    });
  });
});
