if (typeof contenidoLista === 'undefined') {
    var contenidoLista = `<option value="" disabled selected>Elige un platillo</option>`;
}

function agregarALista(platillo, id){
    // Esto es lo que llena tu menú deslizable con los platillos de la base de datos
    contenidoLista += `<option value='${id}'>${platillo.nombre}</option>`;
    
    const lista = document.getElementById("listaPlatillo");
    if (lista) {
        lista.innerHTML = contenidoLista;
        
        // Esto obliga a Materialize a actualizar el menú deslizable en tiempo real
        var elems = document.querySelectorAll('select');
        M.FormSelect.init(elems);
    }
}

M.AutoInit();

// EVENTO PARA GUARDAR EL PEDIDO EN FIREBASE
const formularioPedido = document.querySelector(".add-order");
if (formularioPedido) {
    formularioPedido.addEventListener("submit", (e) => {
        e.preventDefault();

        // MODIFICADO: Captura el valor único (ID) del platillo en lugar de su texto
        const selectPlatillo = document.getElementById("listaPlatillo");
        const idPlatilloSeleccionado = selectPlatillo.value; 
        
        // Objeto con la estructura correcta para tu Firebase
        const pedidoNuevo = {
            platillo: idPlatilloSeleccionado, // Guarda el ID (ej: '0fnTba2ZwwdWpCLv0FWM')
            cliente: document.getElementById("nombre-cliente").value,
            direccion: document.getElementById("direccion-cliente").value,
            fecha: new Date() // Guarda la hora para que lleves control
        };

        // Guardar en la colección "pedidos"
        db.collection("pedidos").add(pedidoNuevo)
        .then(() => {
            alert("¡Pedido guardado con éxito!");
            formularioPedido.reset(); // Limpia los inputs del formulario
            
            // Reinicia el select visual de Materialize
            var elems = document.querySelectorAll('select');
            M.FormSelect.init(elems);
        })
        .catch((error) => {
            console.error("Error al guardar el pedido:", error);
            alert("Hubo un error al guardar tu pedido");
        });
    });
}

const btnUbicacion = document.getElementById("btnUbicacion");
if (btnUbicacion) {
    btnUbicacion.addEventListener("click", function() {
        if (navigator.geolocation){
            navigator.geolocation.getCurrentPosition(exito, error);
        }
    });
}

function exito (posicion){
    let latitud = posicion.coords.latitude; 
    let longitud = posicion.coords.longitude;
    fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitud}&lon=${longitud}&format=json`, {
        headers: {
            'user-Agent': 'UberEatsCUDECJorge (jorge.sag567sg@gmail.com)'
        }
    })
    .then(respuesta => respuesta.json()) 
    .then(data => {
        let ciudad = data.address.city;
        let pais = data.address.country;
        document.getElementById("ubicacion").innerHTML ='${ciudad}, ${pais}';
        
        const campoDireccion = document.getElementById("direccion-cliente");
        if (campoDireccion) {
            campoDireccion.value = data.display_name;
            M.textareaAutoResize(campoDireccion);
        }
    })
    .catch(error => console.error(error)); 
}

function error(err) {
    console.log(err);
    alert("Error al obtener ubicación");
}