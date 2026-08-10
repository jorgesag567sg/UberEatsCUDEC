let contenido = "";

document.addEventListener('DOMContentLoaded', function() {
  // nav menu
  const menus = document.querySelectorAll('.side-menu');
  M.Sidenav.init(menus, {edge: 'right'});
  // add recipe form
  const forms = document.querySelectorAll('.side-form');
  M.Sidenav.init(forms, {edge: 'left'});
});

function mostrarPlatillo(platillo, id){
  let fotoPlatillo;
  if (platillo.imagen) {
    fotoPlatillo = platillo.imagen;
  } else {
    fotoPlatillo = "/img/dish-placeholder.png"; 
  }

  contenido = `
  <div class='card-panel recipe white row' id='${id}' data-id='${id}' style="padding: 10px; margin: 10px auto; max-width: 600px; display: flex; align-items: center; border-radius: 12px;">
    
    <div style="flex: 0 0 80px; margin-right: 15px;">
      <img src="${fotoPlatillo}" alt="${platillo.nombre}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px; display: block;">
    </div>
    
    <div style="flex: 1; min-width: 0;">
      <span class='recipe-title' style="font-size: 1.1rem; font-weight: bold; color: #212121; display: block; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
        ${platillo.nombre}
      </span>
      <span class='recipe-ingredients' style="font-size: 0.85rem; color: #757575; display: block; line-height: 1.2; margin-bottom: 4px; overflow: hidden; text-overflow: ellipsis;">
        ${platillo.ingredientes}
      </span>
      <span class='recipe-price' style='font-size: 0.95rem; font-weight: bold; color: #e65100; display: block;'>
        Precio: $${platillo.precio}
      </span>
    </div>
    
    <div class="recipe-delete" style="flex: 0 0 40px; text-align: right;">
      <i class="material-icons" data-id='${id}' style="color: #d32f2f; cursor: pointer; font-size: 24px; padding: 5px;">
        delete_outline
      </i>
    </div>

  </div>
  `;
  document.querySelector(".recipes").innerHTML += contenido;
}

function actualizarPlatillo(platillo, id){
  let tarjeta = document.getElementById(id);
  if (tarjeta) {
    tarjeta.querySelector(".recipe-title").innerHTML = platillo.nombre;
    tarjeta.querySelector(".recipe-ingredients").innerHTML = platillo.ingredientes;
    tarjeta.querySelector(".recipe-price").innerHTML = platillo.precio;
  }
}

const borrarPlatillo = (id) => {
  const recipe = document.querySelector(`.recipe[data-id="${id}"]`);
  if (recipe) {
    recipe.remove();
  }
};

// --- CÁMARA Y GESTIÓN DE FOTOS ---
let streaming = false;
const width = 320;
let height = 0;

// Obtenemos los elementos del DOM
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const foto = document.getElementById('foto');
const btnFoto = document.getElementById('btnFoto');
const camaraDiv = document.getElementById('camara');

// Evento para activar la cámara cuando das clic en "Iniciar Cámara"
if (btnFoto) {
  btnFoto.addEventListener("click", function(){
    // Si la caja de la cámara estaba oculta, la volvemos a mostrar
    if (camaraDiv) camaraDiv.style.display = "block";

    navigator.mediaDevices
    .getUserMedia({
      video: {
        facingMode: {
          ideal: "environment"
        }
      },
      audio: false
    })
    .then((stream) => {
      video.srcObject = stream;
      video.play();
    })
    .catch((error) => {
      console.log(error);
    });
  });
}

if (video) {
  video.addEventListener("canplay", () => {
    if (!streaming){
      height = video.videoHeight / (video.videoWidth / width);
      video.setAttribute("width", width);
      video.setAttribute("height", height);
      canvas.setAttribute("width", width);
      canvas.setAttribute("height", height);
      streaming = true;
    }
  });
}

// FUNCIÓN CORREGIDA: Toma la foto, detiene la cámara y oculta la vista de video
function tomarFoto(){
  const contexto = canvas.getContext("2d");
  if (width && height){
    canvas.width = width;
    canvas.height = height;
    contexto.drawImage(video, 0, 0, width, height);
    const fotoFinal = canvas.toDataURL("image/png");
    
    const vistaPrevia = document.getElementById("foto-vista");
    if (vistaPrevia) {
      vistaPrevia.setAttribute("src", fotoFinal);
    }
    const inputOculto = document.getElementById("foto");
    if (inputOculto) {
      inputOculto.value = fotoFinal;
    }

    // 1. Apagar el stream de la cámara
    if (video && video.srcObject) {
      const stream = video.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop()); // Apaga el foco de la cámara
      video.srcObject = null;
    }

    // 2. Ocultar el recuadro del video
    if (camaraDiv) {
      camaraDiv.style.display = "none";
    }

    streaming = false;

  } else {
    limpiarFoto();
  }
}

// FUNCIÓN CORREGIDA: Limpia la foto y se asegura de que la cámara quede apagada
function limpiarFoto(){
  const contexto = canvas.getContext("2d");
  if (width && height) {
    contexto.clearRect(0, 0, width, height);
    
    const vistaPrevia = document.getElementById("foto-vista");
    const inputOculto = document.getElementById("foto");
    
    if (vistaPrevia) vistaPrevia.setAttribute("src", "");
    if (inputOculto) inputOculto.value = "";

    // Apagar la cámara si siguiera abierta
    if (video && video.srcObject) {
      const stream = video.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      video.srcObject = null;
    }

    // Ocultar el recuadro de cámara
    if (camaraDiv) {
      camaraDiv.style.display = "none";
    }

    streaming = false;
    console.log("Foto limpiada y cámara detenida correctamente.");
  }
}