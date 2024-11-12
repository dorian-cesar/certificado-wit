<script>
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

    axios.post('./server/escribirFolio.php', datos)
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

    //var patente = localStorage.getItem("patente");
    //  var vehiculoDatos=localStorage.getItem("vehiculoDatos");

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

    // let featuresSelected = arr;

    // Selecciona el contenedor de la lista
    let featuresList = $('#featuresListContainer');

    // Verifica si existen características seleccionadas
    if (featuresSelected && featuresSelected.length > 0) {
        // Recorre cada característica y la añade a la lista
        featuresSelected.forEach(function (feature) {
            let listItem = $('<div></div>').addClass('box');

            listItem.append('  <i class="fas fa-check-circle text-success">   </i>');
            listItem.append(feature);
            featuresList.append(listItem);
        });
    } else {
        // Si no hay características guardadas, muestra un mensaje
        featuresList.append('<li class="list-group-item text-muted">No hay características seleccionadas.</li>');
    }



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
function enviarCorreo() {
    const subject = encodeURIComponent("Certificado");
    const body = encodeURIComponent("Aquí tienes el certificado solicitado.");
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
}
function descargarPDF() {
    // Selecciona el contenido que deseas convertir en PDF
    const element = document.querySelector('.container');

    // Estilo temporal para ajustar el ancho al formato A4
    element.style.width = '800px';

    // Opciones de PDF
    const opciones = {
        margin: 50, // Margen reducido
        filename: 'certificado.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 1, width: 1600 }, // Ajusta la escala
        jsPDF: { unit: 'px', format: 'a4', orientation: 'portrait' }
    };

    // Genera y descarga el PDF
    html2pdf().set(opciones).from(element).save()
        .then(() => {
            // Restablece el estilo original del ancho
            element.style.width = '800px';
        });
}
</script>