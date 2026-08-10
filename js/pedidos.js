if (typeof contenidoLista === 'undefined') {
    var contenidoLista = `<option value="" disabled selected>Elige un platillo</option>`;
}

let map;
let marker; // Variable para controlar un solo marcador y que no se duplique en la pantalla
let qrcode = null; // Variable para controlar la instancia del QR

// 1. Inicializa el mapa base al abrir la página
document.addEventListener('DOMContentLoaded', function() {
    map = L.map('mapa').setView([19.54, -99.19], 12); // Vista inicial general
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
});

function agregarALista(platillo, id){
    contenidoLista += `<option value='${id}'>${platillo.nombre}</option>`;
    const lista = document.getElementById("listaPlatillo");
    if (lista) {
        lista.innerHTML = contenidoLista;
        var elems = document.querySelectorAll('select');
        M.FormSelect.init(elems);
    }
}

M.AutoInit();

// 2. Guardar el pedido en Firebase
const formularioPedido = document.querySelector(".add-order");
if (formularioPedido) {
    formularioPedido.addEventListener("submit", (e) => {
        e.preventDefault();

        const selectPlatillo = document.getElementById("listaPlatillo");
        const idPlatilloSeleccionado = selectPlatillo.value; 
        const nombreCliente = document.getElementById("nombre-cliente").value;
        const direccionCliente = document.getElementById("direccion-cliente").value;
        
        const pedidoNuevo = {
            platillo: idPlatilloSeleccionado, 
            cliente: nombreCliente,
            direccion: direccionCliente,
            fecha: new Date() 
        };

        db.collection("pedidos").add(pedidoNuevo)
        .then((docRef) => {
            alert("¡Pedido guardado con éxito!");

            // Limpiar QR previo si existe
            const contenedorQR = document.getElementById("qrcode");
            if (contenedorQR) {
                contenedorQR.innerHTML = "";
            }

            // //Generar código QR (con la sintaxis de tu foto)
            qrcode = new QRCode("qrcode", {
                text: `Pedido: ${docRef.id} - ${nombreCliente}`,
                width: 128,
                height: 128,
                colorDark : "#000000",
                colorLight : "#ffffff",
                correctLevel : QRCode.CorrectLevel.H
            });

            formularioPedido.reset(); 
            if (marker) map.removeLayer(marker); // Quita el pin viejo al limpiar
            var elems = document.querySelectorAll('select');
            M.FormSelect.init(elems);
        })
        .catch((error) => {
            console.error("Error al guardar el pedido:", error);
            alert("Hubo un error al guardar tu pedido");
        });
    });
}

// 3. NUEVA LÓGICA: Buscar la dirección que el usuario escribió
const btnUbicacion = document.getElementById("btnUbicacion");
if (btnUbicacion) {
    btnUbicacion.addEventListener("click", function() {
        const direccionEscrita = document.getElementById("direccion-cliente").value;

        if (direccionEscrita.trim() === "") {
            alert("Por favor, escribe primero una dirección en el cuadro de texto.");
            return;
        }

        // Consultamos a OpenStreetMap pasándole el texto que escribiste
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(direccionEscrita)}`)
        .then(respuesta => respuesta.json())
        .then(resultados => {
            if (resultados.length > 0) {
                // Tomamos la primera coincidencia que encuentre
                let lugar = resultados[0];
                let latitud = lugar.lat;
                let longitud = lugar.lon;

                // Si ya había un pin puesto antes, lo borramos para no encimar marcadores
                if (marker) {
                    map.removeLayer(marker);
                }

                // Movemos la cámara a la dirección buscada
                map.setView([latitud, longitud], 16);

                // Colocamos el marcador en el lugar exacto que buscaste
                marker = L.marker([latitud, longitud]).addTo(map)
                    .bindPopup(`<b>Dirección encontrada:</b><br>${lugar.display_name}`)
                    .openPopup();
            } else {
                alert("No se encontró ningún lugar con esa dirección. Intenta siendo más específico (añade ciudad o municipio).");
            }
        })
        .catch(error => {
            console.error("Error al buscar la dirección:", error);
            alert("Ocurrió un error en la búsqueda.");
        });
    });
}