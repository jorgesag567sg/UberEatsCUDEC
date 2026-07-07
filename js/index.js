<<<<<<< HEAD
 let contenido = "";
=======
let contenido = "";

btnAgregarPlatillo = document.getElementById('btnAgregarPlatillo');
>>>>>>> f878ff3b267e356af3e4b85a537b60c0687fd0c2

document.addEventListener('DOMContentLoaded', function() {
  // nav menu
  const menus = document.querySelectorAll('.side-menu');
  M.Sidenav.init(menus, {edge: 'right'});
  // add recipe form
  const forms = document.querySelectorAll('.side-form');
  M.Sidenav.init(forms, {edge: 'left'});
});

function mostrarPlatillo(platillo, id){
  contenido = `
  <div class='card-panel recipe white row' id='${id}' data-id='${id}'>
        <div class='recipe-details'>
          <div class='recipe-title'>
            ${platillo.nombre}
            </div>
            <div class='recipe-ingredients'>
            ${platillo.ingredientes}
            </div>
            <div class='recipe-price' style='font-weight: bold; color: #e65100; margin-top: 5px;'>
            Precio: $${platillo.precio}
            </div>
            <div class="recipe-delete">
            <i class="material-icons" data-id='${id}'>
            delete_outline
            </i>
            </div>
          </div>
        </div>
  `;

document.querySelector(".recipes").innerHTML += contenido;
function actualizarPlatillo(platillo,id){
  let tarjeta = document.getElementById('${id}');
  tarjeta.querySelector(".recipe-title").innerHTML= platillo.nombre;
  tarjeta.querySelector(".recipe-ingredients").innerHTML= platillo.ingredientes;
  tarjeta.querySelector(".recipe-price").innerHTML= platillo.precio;
}
const borrarPlatillo = (id) => {
  const recipe = document.querySelector(`.recipe[data-id=${id}]`);
  if (recipe) {
    recipe.remove();
  }
}}
