// declaracion de variables globales

let carrito = [];
let productosJSON = [];
let dolarVenta;
let euroVenta;
let realVenta;
let precioTotal;




// onload para asegurar la carga correcta

window.onload = () => {
    document.querySelector(".form-select").style.background = "#b6abab";
    obtenerValorDolar();
    obtenerValorEuro();
    obtenerValorReal();
    //selector y evento change
    document.querySelector("#miSeleccion option[value='pordefecto']").setAttribute("selected", true);
    document.querySelector("#miSeleccion").onchange = () => ordenar();
};


// selecciono el button para darle eventos 
// INICIO boton1

const boton1 = document.getElementById("boton1");
boton1.addEventListener("click", () => cambiarFondo());
boton1.addEventListener("click", () => mostrarTabla());


if (boton1) {
    boton1.onmouseover = () => {
        boton1.className = "btn btn-danger";
        boton1.textContent = "Selecciona tus productos";
    }

    boton1.onmouseout = () => {
        boton1.className = "btn btn-primary";
        boton1.textContent = "Realiza tu compra"
    }

} else {

};

// funciones para boton1
function cambiarFondo() {
    document.body.classList.toggle("boton1");

}

function mostrarTabla() {
    document.getElementById("carrito").classList.toggle("oculto")
}

//              Fin boton1



// Se crean los objetos mediante un class
// los productos se crea JSON en productos.json

class Producto {
    constructor(producto, cantidad) {
        this.id = producto.id;
        this.nombre = producto.nombre;
        this.marca = producto.marca;
        this.precio = producto.precio;
        this.presentacion = producto.presentacion;
        this.cantidad = cantidad;
        this.precioTotal = producto.precio;
    } // se genera metodos para calcular unidades y total
    agregarUnidad() {
        this.cantidad++;
    }
    quitarUnida() {
        this.cantidad--;
    }
    actualizarPrecioTotal() {
        this.precioTotal = this.precio * this.cantidad;
    }
}

// creamos un afuncion para verificar dentro del localStore si existe algo lo retorna


function chequearCarritoEnStorage() {
    let contenidoEnStorage = JSON.parse(localStorage.getItem("carritoEnStorage"));
    console.log("contenido  Carrito en localStore ", contenidoEnStorage);

    // Si existe el array del carrito, lo retornará al array [aca]
    if (contenidoEnStorage) {
        let array = [];
        for (let i = 0; i < contenidoEnStorage.length; i++) {
            let producto = new Producto(contenidoEnStorage[i]);
            producto.actualizarPrecioTotal();
            array.push(producto);
        }

        return array;
    }
    // Si no existe ese array en el LS, esta función devolverá un array vacío
    return [];
}

// generamos un afuncion para mostrar los productos en el HTML por medio de js

function mostrarLosProductosEnHtml() {
    console.log(productosJSON)
    let productosSeleccionados = document.getElementById("productosSeleccionados")

    for (const producto of productosJSON) {
        let card = document.createElement("div")
        card.innerHTML =
            `<div class="card   mb-3 text-center" style="width: 15rem;">
                <div class="card-body">
                    <img src="${producto.img}" id="" class="card-img-top img-fluid" alt="">
                    <h2 class="card-title">${producto.marca}</h2>
                    <h5 class="card-subtitle mb-2 text-muted">${producto.nombre}</h5>
                    <p class="card-text">$${producto.precio}</p>
                    <div class="btn-group" role="group" aria-label="Basic mixed styles example">
                  <button id="${producto.id}" type="button" class="btn btn-dark btn-carrito"> Agregar </button>
              </div>
            </div>
        </div>`;
        productosSeleccionados.appendChild(card);
        // selecciono el id y con evento le incorporo la funcion de compras
        let boton = document.getElementById(`${producto.id}`);
        boton.onclick = () => menuDeCompras(producto.id);

    }
    // incorporamos un evento para hacer una llamada a un Swetalert con imagen 
    // recorremos un For..of y le asignamos la funcion NotificacionDeCompra()
    const buttons = document.getElementsByClassName("btn-carrito")
    for (const button of buttons) {
        button.addEventListener("click", (e) => {
            let elemento = productosJSON.find(element => element.id == e.target.id)

            NotificacionDeCompra(elemento);
        })
    }
}
// generamos una funcion para generar la tabla donde estara lo que selecciono
// el usuario
function dibujarTabla(array) {
    let contendor = document.getElementById("carrito");
    contendor.innerHTML = "";
    let precioTotal = obtenerPrecioTotal(array);

    let tabla = document.createElement("div");
    tabla.innerHTML = `
        <table id="tablaCarrito" class="table">
            <thead>
                <tr>
                    <th scope="col">Total de la compra</th>
                    <th scope="col">Id</th>
                    <th scope="col">Item</th>
                    <th scope="col">Cantidad</th>
                    <th scope="col">Precio Parcial</th>
                    <th scope="col">Accion</th>
                </tr>
            </thead>

            <tbody id="bodyTabla">
                <tr>
                    <td id='gasto'>Total: $${precioTotal}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    
                </tr>
            </tbody>
        </table>`;

    contendor.appendChild(tabla);

    let bodyTabla = document.getElementById("bodyTabla");
    for (let producto of array) {
        let datos = document.createElement("tr");
        datos.innerHTML += (`
            <tr id = 'fila ${producto.id}'>
                <th scope= 'row'></th>
                <td>${producto.id}</td>
                <td>${producto.nombre}</td>
                <td>${producto.cantidad}</td>
                <td id='gasto'>total: $ ${producto.precioTotal}</td>
                <td><button class= 'btn btn-dark eliminarCompra' onclick= 'eliminar(${producto.id})'>🗑️</button></td>
            </tr>
             `);

        bodyTabla.appendChild(datos);
    }
    let botonDepago = document.getElementById("bodyTabla");
    let botonPagar = document.createElement("div");
    botonPagar.innerHTML = `
        <tbody id = "bodyTabla">
            <tr>
            <td>Total: $${precioTotal}</td>
            <td id="pago1">
                <button id = "finalizarCompra" class = "btn btn-primary botonDepago">Finalizar Compra?</button>
            </td>
            </tr>
        </tbody>`;
    botonDepago.appendChild(botonPagar);

    let finalizarCompra = document.getElementById("finalizarCompra");
    finalizarCompra.onclick = () => {
        let pago1 = document.getElementById("bodyTabla");
        let tomarPago = document.createElement("td");
        tomarPago.innerHTML = `
        <div>
        <input type="text" class="form-control" id="moneda" placeholder="Antes de continuar ingrese la moneda con la que va a pagar" aria-label= "Username">
        <p>Escriba la moneda con la que abonara, Dolar, Real, Euro, Bolivar, Pesos</P>
        <button id= "pagarCompra" type= "button" class= "btn btn-primary mb-3" onclick= "getValueInput()">Pagar</button>
        </div>`;
        pago1.appendChild(tomarPago);

        // se incorpora un ejemplo de ternario con If..Else por un swetAlert

        let compra = `${precioTotal}`;
        compra < 1000 ?
            Swal.fire({
                position: 'top-end',
                icon: 'warning',
                title: `El total de $${precioTotal} no supere los $1000 para un descuento, lo siento`,
                showConfirmButton: false,
                timer: 3000
            }) : Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Felicitaciones !!! tiene un descuento especial',
                showConfirmButton: false,
                timer: 3000
            });
        document.getElementById("finalizarCompra").remove(finalizarCompra);
    }

}

function obtenerPrecioTotal(array) {
    let precioTotal = 0;
    for (const producto of array) {
        precioTotal += producto.precioTotal;
    }
    return precioTotal;
}



// INICIO de convertidor de moneda utilizado como opcion de pago
// se incorpora JSON para tomar el valor de moneda en tiempo real
function dividir(num1, num2) {
    return num1 / num2;
}

function igual(num1) {
    return num1;
}
// se incorpora JSON
function cambiarDolar() {
    return dolarVenta;
}
// se incorpora JSON
function cambiarEuro() {
    return euroVenta;
}

function cambiarBolivar() {
    return 15.54;
}
// se incorpora JSON
function cambiarReal() {
    return realVenta;
}

function convertir(a, inputValue) {

    let resultado;
    switch (inputValue.toLowerCase()) {
        case "real":
            resultado = dividir(a, cambiarReal());
            resultado = resultado.toFixed(2);
            break;
        case "bolivar":
            resultado = dividir(a, cambiarBolivar());
            resultado = resultado.toFixed(2);
            break;
        case "euro":
            resultado = dividir(a, cambiarEuro());
            resultado = resultado.toFixed(2);
            break;
        case "dolar":
            resultado = dividir(a, cambiarDolar());
            resultado = resultado.toFixed(2);
            break;
        case "pesos":
            resultado = igual(a);
            resultado = resultado;
            break;
        default:
            alert("Operación inválida, revise el nombre de la moneda ingresada");
    }
    return resultado;

}

/// librerias en funciones


const getValueInput = () => {
    inputValue = document.getElementById("moneda").value;
    IniciarConv(inputValue);

    console.log(inputValue);
}
let inputValue;

function IniciarConv() {
    let inicio = document.getElementById("pagarCompra")
    inicio.onclick = () => {
        Swal
            .fire({
                title: "FELICITACION !! Esta por abonar su compra",
                text: "¿PAGAR?",
                icon: 'info',
                showCancelButton: true,
                confirmButtonText: "Sí, PAGAR",
                cancelButtonText: "Cancelar",
            })
            .then(resultado => {
                if (resultado.value) {
                    // Hicieron click en "Sí"

                    let operacion = inputValue;
                    console.log(inputValue);

                    precioTotal = obtenerPrecioTotal(carrito);
                    let resultado1 = convertir(precioTotal, inputValue);
                    // datos.innerHTML = "";
                    // contenidoEnStorage = [];

                    /// incorporamos condicional ternario

                    resultado1 != undefined ? Swal.fire({
                        /// incoporo librerias
                        position: 'center',
                        icon: 'info',
                        title: `Para abonar $${precioTotal} la compra en ${operacion} usted debe despositar ${resultado1} en  ${operacion}`,
                        showConfirmButton: false,

                    }) : alert("error");



                    console.log("*se elimina la venta*");
                    vaciarTabla(carrito);
                } else {
                    // Dijeron que no
                    console.log("*NO se elimina la venta*");
                }


            });

    }

}

// funcion para vaciar la tabla
function vaciarTabla() {
    for (let i = carrito.length; i > 0; i--) {
        carrito.pop();
    }
    let contendor = document.getElementById("carrito");
    contendor.innerHTML = "";
    console.log(carrito);
}

// funcion para realizar la compra

function menuDeCompras(idProducto) {
    let productoEnCarrito = carrito.find((elemento) => elemento.id == idProducto);
    if (productoEnCarrito) {
        // con index (indice) vemos donde se encuentra el producto en el carrito
        //  y ese orden verificamos si existe,
        let index = carrito.findIndex((elemento) => elemento.id === productoEnCarrito.id);

        carrito[index].agregarUnidad();
        carrito[index].actualizarPrecioTotal();

    } else {
        let producto = new Producto(productosJSON[idProducto]);
        producto.cantidad = 1;
        carrito.push(producto);
    }
    localStorage.setItem("carritoEnStorage", JSON.stringify(carrito));
    dibujarTabla(carrito);

}

function eliminar(id) {
    let producto = carrito.find((producto) => producto.id === id);
    let index = carrito.findIndex((element) => {
        if (element.id === producto.id) {
            return true;
        }
    });
    if (producto.cantidad > producto.cantidad) {
        carrito[index].quitarUnidad();
        carrito[index].actualizarPrecioTotal();


    } else {
        carrito.splice(index, 1);
    }
    if (carrito.lenght === 0) {
        carrito = [];
    }
    localStorage.setItem("carritoEnStorage", JSON.stringify(carrito));
    dibujarTabla(carrito);
    ordenar();

}


// funcion para notificar compra
function NotificacionDeCompra(prod) {

    Swal.fire({
        title: `${prod.marca}`,
        text: `Agregaste un ${prod.nombre.toLowerCase()}  tu compra`,
        imageUrl: `${prod.img}`,
        imageWidth: 200,
        imageHeight: 150,
        imageAlt: 'Custom image',
        timer: 1500
    })

}



let botonBusqueda = document.getElementById("busqueda1");
botonBusqueda.addEventListener("click", filtroBusqueda)

function filtroBusqueda(e) {
    e.preventDefault()
    console.log("asd")
    let input = document.getElementById("nombreBusqueda").value.toLowerCase();
    let datos = productosJSON.filter((elemento) => elemento.nombre.toLowerCase().includes(input))
    console.log("datos", datos);
    if (datos != "" && input != "") {
        Swal.fire({
            text: `${datos[0].nombre} esta disponible en nuestra tienda`,
            title: `Marca:  ${datos[0].marca}`,
            imageUrl: `${datos[0].img}`,
            imageWidth: 200,
            imageHeight: 150,
            imageAlt: 'Custom image',
            // timer: 3500
        })
    } else {
        Swal.fire({
            text: `El producto no existe !!`,

        })
    }

}


nombreBusqueda.oninput = () => {
    if (isNaN(nombreBusqueda.value) == false) {
        nombreBusqueda.style.color = "red";
        console.log(nombreBusqueda.value)
    } else {
        nombreBusqueda.style.color = "black";
    }
}

// async con una funcioncion 

async function obtenerJSON() {
    const URLJSON = "/productos.json"
    const resp = await fetch("productos.json")
    const data = await resp.json()
    productosJSON = data;
    mostrarLosProductosEnHtml();

}

function ordenar() {
    let seleccion = document.querySelector("#miSeleccion").value;

    console.log(seleccion)
    if (seleccion == "menor") {
        productosJSON.sort(function (a, b) {
            return a.precio - b.precio

        });
    } else if (seleccion == "mayor") {
        productosJSON.sort(function (a, b) {
            return b.precio - a.precio
        });
    } else if (seleccion == "alfabetico") {
        productosJSON.sort(function (a, b) {
            return a.nombre.localeCompare(b.nombre);
        });
    }
    document.getElementById("productosSeleccionados").innerHTML = " ";

    mostrarLosProductosEnHtml();

}

//function para obtener el valor de las monedas en tiempo real

async function obtenerValorDolar() {
    const URLDOLAR = "https://api-dolar-argentina.herokuapp.com/api/dolarblue";
    const resp = await fetch(URLDOLAR)
    const data = await resp.json()
    document.querySelector("#fila_prueba").innerHTML += (`<h5 class = "text-white h5">Dolar compra: $ ${data.compra} Dolar venta: $ ${data.venta}</h5>`);
    dolarVenta = data.venta;

}

async function obtenerValorEuro() {
    const URLDOLAR = "https://api-dolar-argentina.herokuapp.com/api/euro/nacion";
    const resp = await fetch(URLDOLAR)
    const data = await resp.json()
    document.querySelector("#fila_prueba").innerHTML += (`<h5 class = "text-white h5">Euro compra: $ ${data.compra} Euro venta: $ ${data.venta}</h5>`);
    euroVenta = data.venta;

}

async function obtenerValorReal() {
    const URLDOLAR = "https://api-dolar-argentina.herokuapp.com/api/real/nacion";
    const resp = await fetch(URLDOLAR)
    const data = await resp.json()
    document.querySelector("#fila_prueba").innerHTML += (`<h5 class = "text-white h5">Real compra: $ ${data.compra} Real venta: $ ${data.venta}</h5>`);
    realVenta = data.venta;

}




obtenerJSON();



carrito = chequearCarritoEnStorage();

dibujarTabla(carrito);