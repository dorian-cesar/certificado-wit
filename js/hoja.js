$(document).ready(() => {
  // Cargar datos guardados
  const datosVehiculo = JSON.parse(localStorage.getItem("vehiculoDatos"));
  if (!datosVehiculo) {
    console.error("No hay datos guardados en localStorage.");
    return;
  }

  // Inicializar variables
  const patente = datosVehiculo.patente;
  const codigo = generarClaveAleatoria(10);
  const fechaHoraActual = new Date().toISOString();
  const datos = { patente, codigo, fechaHora: fechaHoraActual };

  // Cargar secciones externas
  $("#whatsapp").load("ws.html");
  $("#contenido-tabla").load("tabla.html");

  // Enviar datos al servidor y obtener el folio
  axios
    .post(
      "https://masgps-bi.wit.la/certificado-wit/server/escribirFolio.php",
      datos
    )
    .then((response) => {
      const folio = response.data.id;
      $("#folio").text(folio);
      localStorage.setItem("folio", JSON.stringify(folio));
    })
    .catch((error) =>
      console.error("Error al enviar datos al servidor:", error)
    );

  // Generar y mostrar el QR
  const qrData = `${codigo}/${patente}`;
  generarQR(qrData);

  // Mostrar fechas
  $("#date").text(formatearFecha(new Date()));
  $("#fechaVencimiento").text(formatearFecha(sumarAño(new Date())));

  // Mostrar información del vehículo
  if (patente) {
    $("#patente").text(patente);
    $("#verify").text(codigo);
    $("#imei").text(datosVehiculo.imei);
    $("#lpf").html(datosVehiculo.last_update);
    $("#rut").text(datosVehiculo.RUT);
    $("#razon").text(datosVehiculo.Razon_Social);
  }

  // Configurar botón de mapa
  $("#lpf").click(() => window.open("./mapa.html", "_blank"));

  // Mostrar coordenadas en consola
  console.log(`${datosVehiculo.lat},${datosVehiculo.long}`);
});

// Funciones auxiliares
function generarClaveAleatoria(longitud) {
  const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length: longitud }, () =>
    caracteres.charAt(Math.floor(Math.random() * caracteres.length))
  ).join("");
}

function generarQR(texto) {
  new QRCode(document.getElementById("qrCode"), {
    text: texto,
    width: 200,
    height: 200,
  });
}

function formatearFecha(fecha) {
  const dd = String(fecha.getDate()).padStart(2, "0");
  const mm = String(fecha.getMonth() + 1).padStart(2, "0");
  const yyyy = fecha.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function sumarAño(fecha) {
  const nuevaFecha = new Date(fecha);
  nuevaFecha.setFullYear(nuevaFecha.getFullYear() + 1);
  return nuevaFecha;
}

const opciones = {
  margin: 1,
  filename: "documento.pdf",
  image: { type: "jpeg", quality: 0.98 },
  html2canvas: { scale: 1, width: 1000 },
  jsPDF: { unit: "cm", format: "a4", orientation: "portrait" },
};

// Función para descargar el PDF
function descargarPDF() {
  const element = document.querySelector(".container");

  html2pdf().set(opciones).from(element).save();
}

// Abrir modal de correo
function abrirModalCorreo() {
  $("#modalCorreo").modal("show");
}

// Enviar correo con PDF
$("#btnEnviarCorreo").click(() => {
  const email = $("#email").val();
  if (!email) {
    alert("Por favor, ingrese un correo electrónico.");
    return;
  }

  const element = document.querySelector(".container");

  html2pdf()
    .set(opciones)
    .from(element)
    .toPdf()
    .output("datauristring")
    .then((pdfBase64) => {
      $.post("https://masgps-bi.wit.la/certificado-wit/server/send_mail.php", {
        pdfBase64,
        email,
      })
        .done(() => alert("Correo enviado correctamente."))
        .fail(() => alert("Hubo un error al enviar el correo."));
    });

    $('#modalCorreo').modal('hide');
});
