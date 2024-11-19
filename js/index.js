$("#alert").load("alerta.html");
// Función para calcular la diferencia en días entre dos fechas
function calcularDiferenciaDias(fechaInicio, fechaFin) {
  const unDia = 24 * 60 * 60 * 1000; // Milisegundos en un día
  return Math.floor((fechaFin - fechaInicio) / unDia);
}
// Manejar el evento de envío del formulario
$("#consultaForm").submit(function (event) {
  event.preventDefault();

  const patente = $("#patente").val();

  // Realizar la solicitud POST a la API
  //https://masgps-bi.wit.la
  //http://localhost/
  axios
    .post("https://masgps-bi.wit.la/certificado-wit/server/getData.php", {
      patente: patente,
    })
    .then((response) => {
      // Mostrar los datos en la tabla

      const datosVehiculo = response.data;
      // Convertir la fecha de last_update a un objeto Date
      const fechaLastUpdate = new Date(datosVehiculo.last_update);
      const fechaActual = new Date();

      // Calcular la diferencia en días
      const diasDiferencia = calcularDiferenciaDias(
        fechaLastUpdate,
        fechaActual
      );
      console.log("dias=" + diasDiferencia);
      // Si la diferencia es mayor a 3 día, mostrar alerta y no mostrar datos
      if (diasDiferencia > 3) {
        var message2 =
          `El vehículo está fuera de línea. Sin reportar hace ${diasDiferencia} dias ${datosVehiculo.last_update} 
          Comuniquese <a href="mailto:soporte@wit.la?subject=Consulta%20Certificado" target="_blank">con nuestra área de soporte</a>, para verificar el estado de operatividad del dispositivo`;
        mostrarModal(message2, function () {
          console.log("Otro mensaje aceptado.");
        });

        $("#resultado").addClass("d-none");
        return;
      }
      // Recolecta los valores de los checkboxes
      let selectedFeatures = [];
      $('input[name="features"]:checked').each(function () {
        selectedFeatures.push($(this).val());
      });

      // Guarda los valores seleccionados en localStorage
      localStorage.setItem(
        "featuresSelected",
        JSON.stringify(selectedFeatures)
      );
      // Llenar la tabla con los datos obtenidos
      const tbody = $("#vehiculoDatos");
      tbody.empty();
      tbody.append(`
            <tr>
                <td>${datosVehiculo.patente}</td>
                <td>${datosVehiculo.last_update}</td>
                <td>${datosVehiculo.imei}</td>
                <td>${datosVehiculo.descCentroCosto}</td>
                <td>${datosVehiculo.unidadNegocio}</td>
                <td>${datosVehiculo.descFlota}</td>
            </tr>
            
        `);

      // Mostrar la sección de resultados
      $("#resultado").removeClass("d-none");

      // Guardar los datos en localStorage
      localStorage.setItem("vehiculoDatos", JSON.stringify(datosVehiculo));
    })
    .catch((error) => {
      console.error("Error al consultar el vehículo:", error);
      alert(
        "No se encontraron datos para la patente ingresada o ocurrió un error."
      );
    });
});
$("#descargarCertificado").click(function () {
  var message =
    "Tu certificado se ha generado con éxito. Recuerda que tiene una vigencia de 1 año.";
  mostrarModal(message, function () {
    window.open("hoja.html", "_blank"); // Acción personalizada
  });
});
