document.addEventListener("DOMContentLoaded", function () {
    const datosGuardados = localStorage.getItem("vehiculoDatos");
    const datosVehiculo = JSON.parse(datosGuardados);
    const verify = generarClaveAleatoria(10);
    const patente = datosVehiculo.patente;

    const datos = {
        patente: patente,
        codigo: verify,
        fechaHora: new Date().toISOString(),
    };

    axios.post('https://masgps-bi.wit.la/certificado-wit/server/escribirFolio.php', datos)
        .then(response => {
            const folio = response.data.id;
            document.getElementById("folio").textContent = folio;
        });

    generarQR(verify);

    const today = new Date();
    const formattedDate = today.toLocaleDateString("es-CL");
    document.getElementById("date").textContent = formattedDate;

    const nextYear = new Date(today.setFullYear(today.getFullYear() + 1));
    document.getElementById("fechaVencimiento").textContent = nextYear.toLocaleDateString("es-CL");
});

function generarClaveAleatoria(length) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join("");
}

function generarQR(text) {
    new QRCode(document.getElementById("qrCode"), {
        text: text,
        width: 200,
        height: 200,
    });
}
