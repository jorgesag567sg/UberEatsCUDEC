if (typeof contenidoLista === 'undefined') {
    var contenidoLista = `<option value="" disabled selected>Elige un platillo</option>`;
}

function agregarALista(platillo, id){
    // Añade el platillo real de la base de datos a la lista
    contenidoLista += `<option value='${id}'>${platillo.nombre}</option>`;
    
    const lista = document.getElementById("listaPlatillo");
    if (lista) {
        lista.innerHTML = contenidoLista;
        
        // CRUCIAL: Esto le dice a Materialize que vuelva a activar el deslizar con los nuevos datos
        var elems = document.querySelectorAll('select');
        M.FormSelect.init(elems);
    }
}

M.AutoInit();

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
    .then(data => alert(data.display_name))
    .catch(error => console.error(error)); 
}

function error(err) {
    console.log(err);
    alert("Error al obtener ubicación");
}