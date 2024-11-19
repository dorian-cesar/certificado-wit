$(document).ready(function () {
    const datosGuardados = localStorage.getItem('vehiculoDatos');
    const datosVehiculo = JSON.parse(datosGuardados);
    var verify = generarClaveAleatoria(10);
    const codigo = verify;
    const patente = datosVehiculo.patente;
    const fechaHoraActual = new Date().toISOString();

    const datos = {
        patente: patente,
        codigo: codigo,
        fechaHora: fechaHoraActual
    };
    $("#whatsapp").load("ws.html");
    $("#contenido-tabla").load("tabla.html");
    axios.post('https://masgps-bi.wit.la/certificado-wit/server/escribirFolio.php', datos)
        .then(response => {
            console.log('Datos enviados correctamente:', response.data);
            const folio = response.data.id;
            $("#folio").text(folio);

            localStorage.setItem(
                "folio",
                JSON.stringify(folio)
            );
        });

    verify = verify + '/' + patente;
    console.log(verify);
    // Función para generar el código QR
    function generarQR(verify) {
        var qr = new QRCode(document.getElementById("qrCode"), {
            text: verify,
            width: 200,
            height: 200,
        });
    }

    // Llamada a la función para generar el código QR
    generarQR(verify); // Puedes cambiar "https://ejemplo.com" por la URL que desees codificar en el QR

    // Obtener la fecha actual
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); // Enero es 0!
    var yyyy = today.getFullYear();

    today = dd + "/" + mm + "/" + yyyy;

    // Actualizar el contenido del elemento con id "date"
    $("#date").text(today);
    // Obtener la información del localStorage
    // Añadir un año a la fecha actual
    var nextYear = new Date(yyyy + 1, mm - 1, dd); // Restar 1 al mes ya que en JavaScript los meses van de 0 a 11
    var ddNextYear = String(nextYear.getDate()).padStart(2, "0");
    var mmNextYear = String(nextYear.getMonth() + 1).padStart(2, "0");
    var yyyyNextYear = nextYear.getFullYear();

    var fechaVencimiento =
        ddNextYear + "/" + mmNextYear + "/" + yyyyNextYear;

    $("#fechaVencimiento").text(fechaVencimiento);



    // const patente = datosVehiculo.patente;
    const rut = datosVehiculo.RUT;
    const razonSocial = datosVehiculo.Razon_Social;
    const lat = datosVehiculo.lat;
    const lng = datosVehiculo.long;
    const coord = lat + ',' + lng;
    const urlmap = './mapa.html';
    //$("#lpf").attr("href", urlmap, "_blank");
    $("#lpf").click(function () {
        window.open(urlmap, "_blank");
    });

    console.log(coord);


    // Recupera los datos de 'featuresSelected' de localStorage
    let featuresSelected = JSON.parse(localStorage.getItem('featuresSelected'));


    // Selecciona el contenedor de la lista
    let featuresList = $('#featuresListContainer');


    // Verificar si la información existe en el localStorage
    if (patente) {
        // Mostrar la información en el elemento con id "patente"
        $("#patente").text(patente);
        $("#verify").text(codigo);
        $("#imei").text(datosVehiculo.imei);
        $("#lpf").html(datosVehiculo.last_update);
        $("#rut").text(rut);
        $("#razon").text(razonSocial);

    }

    function generarClaveAleatoria(longitud) {
        var caracteres =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        var clave = "";

        for (var i = 0; i < longitud; i++) {
            var indice = Math.floor(Math.random() * caracteres.length);
            clave += caracteres.charAt(indice);
        }

        return clave;
    }
});

function descargarPDF() {
    // Selecciona el contenido que deseas convertir en PDF
    const element = document.querySelector('.container');

    // Estilo temporal para ajustar el ancho al formato A4
    //  element.style.width = '18cm';

    // Opciones de PDF
    const opciones = {

        margin: 1,// Márgenes en centímetros (ajusta según sea necesario)
        filename: 'documento.pdf', // Nombre del archivo PDF
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 1, width: 1000 },
        jsPDF: { unit: 'cm', format: 'a4', orientation: 'portrait' } // formato A4
    };

    // Genera y descarga el PDF
    html2pdf().set(opciones).from(element).save()
        .then(() => {
            // Restablece el estilo original del ancho
            //  element.style.width = '800px';
        });
}
function abrirModalCorreo() {

    $('#modalCorreo').modal('show');
}
$('#btnEnviarCorreo').click(function () {
    const email = $('#email').val();
    // Selecciona el contenido que deseas convertir en PDF
    const element = document.querySelector('.container');


    if (!email) {
        alert('Por favor, ingrese un correo electrónico.');
        return;
    }
    $('#modalCorreo').modal('hide');

    // Configurar las opciones para el PDF en tamaño A4
    const options = {
        margin: 1,// [1, 2, 1, 2],        // Márgenes en centímetros (ajusta según sea necesario)
        filename: 'documento.pdf', // Nombre del archivo PDF
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 1, width: 1000 },
        jsPDF: { unit: 'cm', format: 'a4', orientation: 'portrait' } // formato A4
    };
    // Generar PDF y enviarlo al backend en base64
    html2pdf().set(options).from(element).toPdf().output('datauristring').then(function (pdfBase64) {
        $.ajax({
            url: 'https://masgps-bi.wit.la/certificado-wit/server/send_mail.php',
            type: 'POST',

            data: { pdfBase64: pdfBase64, email: email },
            success: function (response) {
                alert('Correo enviado correctamente.');
            },
            error: function () {
                alert('Hubo un error al enviar el correo.');
            }
        });
    });



});
