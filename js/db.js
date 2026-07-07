db.collection("platillos").onSnapshot((datos) => {
   
    datos.docChanges().forEach((registro) => {
        if (registro.type == "added") {
            console.log(registro.doc.data(), registro.doc.id);
            
            // Escudo para que index.js no rompa nada en pedidos.html
            const contenedorRecetas = document.querySelector(".recipes");
            if (contenedorRecetas && typeof mostrarPlatillo === "function") {
                mostrarPlatillo(registro.doc.data(), registro.doc.id);
            }
            
            const selectPlatillos = document.getElementById('listaPlatillo');
            if (selectPlatillos && typeof agregarALista === "function") {
                agregarALista(registro.doc.data(), registro.doc.id);
            }
        }
        if (registro.type === "modified"){
            const contenedorRecetas = document.querySelector(".recipes");
            if (contenedorRecetas && typeof actualizarPlatillo === "function") {
                actualizarPlatillo(registro.doc.data(), registro.doc.id);
            }
        }
        // NUEVO: Borrado instantáneo de la tarjeta en la interfaz sin recargar la página
        if (registro.type === "removed") {
            const platilloElemento = document.querySelector(`.recipe[data-id="${registro.doc.id}"]`);
            if (platilloElemento) {
                platilloElemento.remove();
            }
        }
    });
}); 

const formularioAgregar = document.querySelector("form");
if (formularioAgregar) {
    formularioAgregar.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const platilloNuevo = {
            nombre: formularioAgregar.title.value,
            ingredientes: formularioAgregar.ingredients.value,
            precio: formularioAgregar.price.value,
        };
        
        db.collection("platillos").add(platilloNuevo)
        .catch((error) => {
            console.log(error); 
            alert("Error al agregar platillo");
        });

        formularioAgregar.title.value = "";
        formularioAgregar.ingredients.value = "";
        formularioAgregar.price.value = "";
        
        alert("Platillo agregado");
    });
}

const platilloBorrar = document.querySelector(".recipes");
if (platilloBorrar) {
    platilloBorrar.addEventListener("click", (e) => {
        if (e.target.tagName === 'I') {
            const id = e.target.getAttribute("data-id");
            const respuesta = confirm("¿Estás seguro de borrar este platillo?");
            
            if (respuesta) {
                db.collection("platillos").doc(id).delete()
                .catch((error) => {
                    console.log("Error al borrar en Firebase:", error);
                });
            }
        }
    });
}
