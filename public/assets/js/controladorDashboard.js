$(document).ready(function () {
    cargarArchivos();
})

function cargarArchivos() {
    let clase;
    $.ajax({
        url: "/obtenerArchivos",
        method: "get",
        success: function (respuestas) {
            for (respuesta of respuestas) {
                console.log(respuestas)
                if (respuesta.favorito == 1) {
                    clase = "favorito"
                } else {
                    clase = "notFav";
                }
                $("#archivos").append(
                    `<div class="col-xl-4 col-lg-4 col-md-6 col-sm-10 col-12" idBorrar=${respuesta.codigo_archivo}>
                    <div class="card">
                        <div class="card-header">
                            ${respuesta.nombre_archivo}
                            <span idArchivo=${respuesta.codigo_archivo} class="${clase}  darFavorito">
                                <i class="far fa-star"></i>
                            </span>
                        </div>
                        <img class="card-img-top S" src="${respuesta.icono}.svg" width="125" height="125" alt="Card image cap">
                        <div class="card-body text-center">
                            <button idActualizar=${respuesta.codigo_archivo} class="btn btn-info actualizar">Ver</button>
                            <button class="btn btn-danger borrarArchivo">Borrar</button>
                            <button data-toggle="modal" data-target="#exampleModal" IdVerArchivo=${respuesta.codigo_archivo} class="btn btn-success compartir">Compartir</button>
                            <button idArchivo=${respuesta.codigo_archivo} class="btn btn-dark descargar ">Descargar</button>
                        </div>
                        <div class="card-footer text-muted">
                            ${new Date(respuesta.fecha_creacion).toDateString() }
                        </div>
                    </div>
                </div>`
                )
            }
        }
    })
}

$("#buscar").keypress(function () {

})

$("#recientes").click(function () {
    $.ajax({
        url: "/recientes",
        method: "GET",
        success: function (respuestas) {
            $("#archivos").html("");
            for (respuesta of respuestas) {
                console.log(respuestas)
                if (respuesta.favorito == 1) {
                    clase = "favorito"
                } else {
                    clase = "notFav";
                }
                $("#archivos").append(
                    `<div class="col-xl-4 col-lg-4 col-md-6 col-sm-10 col-12" idBorrar=${respuesta.codigo_archivo}>
                    <div class="card">
                        <div class="card-header">
                            ${respuesta.nombre_archivo}
                            <span idArchivo=${respuesta.codigo_archivo} class="${clase}  darFavorito">
                                <i class="far fa-star"></i>
                            </span>
                        </div>
                        <img class="card-img-top S" src="${respuesta.icono}.svg" width="125" height="125" alt="Card image cap">
                        <div class="card-body text-center">
                            <button idActualizar=${respuesta.codigo_archivo} class="btn btn-info actualizar">Ver</button>
                            <button class="btn btn-danger borrarArchivo">Borrar</button>
                            <button data-toggle="modal" data-target="#exampleModal" IdVerArchivo=${respuesta.codigo_archivo} class="btn btn-success compartir">Compartir</button>
                            <button idArchivo=${respuesta.codigo_archivo} class="btn btn-dark descargar ">Descargar</button>
                        </div>
                        <div class="card-footer text-muted">
                            ${new Date(respuesta.fecha_creacion).toDateString() }
                        </div>
                    </div>
                </div>`
                )
            }
        }
    })
})

$(document).on("click", ".actualizar", function () {
    let elemento = $(this)[0];
    let id = $(elemento).attr("idActualizar");
    let parametros = {
        id
    };
    $.ajax({
        url: "/actualizarArchivo",
        data: parametros,
        dataType: "json",
        method: "POST",
        success: function (respuesta) {

            if (respuesta.estatus === 1) {
                window.location.href = "/actualizarArchivo";
            }
        }
    })
})

$("#papelera").click(function () {
    $.ajax({
        url: "/papelera",
        method: "get",
        success: function (respuestas) {
            $("#archivos").html("")
            for (respuesta of respuestas) {
                console.log(respuestas)
                $("#archivos").append(
                    `<div class="col-xl-4 col-lg-4 col-md-6 col-sm-10 col-12">
                    <div class="card">
                    <div class="card-header">
                    ${respuesta.nombre_archivo}
                  </div> 
                        <img class="card-img-top S" src="${respuesta.icono}.svg"width="125" height="125"  alt="Card image cap">
                        <div class="card-body text-center">
                            <a idRestaurar=${respuesta.codigo_archivo} class="btn btn-info restaurar">Restaurar</a>
                            <button idPapelera=${respuesta.codigo_archivo} class="btn btn-danger papelera">Borrar</button>
                        </div>
                        <div class="card-footer text-muted">
                        ${new Date(respuesta.fecha_creacion).toDateString() }
                      </div>
                    </div>
                </div>`
                )
            }
        }
    })
})

$(document).on("click", ".papelera", function () {
    let elemento = $(this)[0];
    let id = $(elemento).attr("idPapelera");
    let parametros = {
        id
    }
    $.ajax({
        url: "/eliminarTotalmente",
        data: parametros,
        dataType: "json",
        method: "POST",
        success: function (respuesta) {
            console.log(respuesta);
        }
    })
})

$(document).on("click", ".restaurar", function () {
    let elemento = $(this)[0];
    let id = $(elemento).attr("idRestaurar");
    let parametros = {
        id
    }
    $.ajax({
        url: "/restaurar",
        data: parametros,
        dataType: "json",
        method: "POST",
        success: function (respuesta) {}
    })
    $("#archivos").html("");
    $("#papelera").click();
})

$(document).on("click", ".borrarArchivo", function () {
    let elemento = $(this)[0].parentElement.parentElement.parentElement;
    let id = $(elemento).attr("idBorrar");
    console.log(id);
    let parametros = {
        id
    }
    $.ajax({
        url: "/eliminar",
        method: "post",
        data: parametros,
        dataType: "json",
        success: function (respuesta) {}
    })
    $("#archivos").html("")
    cargarArchivos();
})

$(document).on("click", ".darFavorito", function () {
    let elemento = $(this)[0];
    $(elemento).toggleClass("favorito");
    var fav;
    let id = $(elemento).attr("idArchivo");
    if ($(elemento).hasClass("favorito")) {
        fav = 1;
    } else {
        fav = 0;

    }
    console.log(fav);
    console.log(id);
    let parametros = {
        id,
        fav
    }
    $.ajax({
        url: "/favorito",
        data: parametros,
        dataType: "json",
        method: "POST",
        success: function (respuesta) {
            console.log(respuesta);
        }
    })
})


$(document).on("click", ".descargar", function () {
    let elemento = $(this)[0];
    let id = $(elemento).attr("idArchivo");
    console.log(id);
    let parametros = {
        id
    }
    $.ajax({
        url: "/descargar",
        data: parametros,
        dataType: "json",
        method: "POST",
        success: function (respuesta) {

        }
    })
})
$("#favoritos").click(function () {
    $.ajax({
        url: "/verFavoritos",
        method: "GET",
        success: function (respuestas) {
            $("#archivos").html("");
            if (respuestas.length < 1) {
                $("#archivos").append(
                    `<div class="col-md-6 col-12">
                    <div>
                        <div class="card-body text-center text-md-left">
                            <span class="float-md-left mx-2 mb-md-5 mt-md-3 mt-lg-0 mb-lg-2" style="color:#FDD14D ; font-size: 60px;">
                                <i class="fas fa-star"></i>
                            </span>
                            <div class="mt-2">
                                <h5 class="card-title">No hay Archivos ni carpetas destaacados</h5>
                                <p class="card-text">Añade estrellas a los elementos que quieras encontrar facilmente</p>
                            </div>
                        </div>
                    </div>
                </div>`
                )
            } else {
                for (respuesta of respuestas) {
                    console.log(respuestas)
                    $("#archivos").append(
                        `<div class="col-xl-4 col-lg-4 col-md-6 col-sm-10 col-12">
                        <div class="card">
                        <div class="card-header">
                        ${respuesta.nombre_archivo}
                        <span idArchivo=${respuesta.codigo_archivo} class="favorito darFavorito"><i class="far fa-star"></i></span>
                      </div> 
                            <img class="card-img-top S" src="${respuesta.icono}.svg"width="125" height="125"  alt="Card image cap">
                            <div class="card-body text-center">
                                <button idActualizar=${respuesta.codigo_archivo} class="btn btn-info actualizar">Ver</button>
                                <button idBorrar=${respuesta.codigo_archivo} class="btn btn-danger borrarArchivo">Borrar</button>
                                <button IdVerArchivo=${respuesta.codigo_archivo} class="btn btn-success compartir">Compartir</button>
                            </div>
                            <div class="card-footer text-muted">
                            ${respuesta.fecha_creacion}
                          </div>
                        </div>
                    </div>`
                    )
                }
            }
        }
    })
});

$("#unidad").click(function () {
    $("#archivos").html("");

    cargarArchivos();
})
$(document).on("click", ".compartir", function () {
    let elemento = $(this)[0];
    let id = $(elemento).attr("IdVerArchivo");
    $.ajax({
        url: "/contactos",
        method: "get",
        success: function (respuestas) {
            for (respuesta of respuestas) {
                $("#usuarios").append(
                    `<tr>
                    <th scope="row">${respuesta.codigo_usuario}</th>
                    <td>${respuesta.nombre}</td>
                    <td><button idUusuario="${respuesta.codigo_usuario}" idArchivo=${id} class="btn btn-success compartido">Compartir</button></td>
                </tr>`
                )
            }
        }
    })
})

$(document).on("click", ".compartido", function () {
    let elemento = $(this)[0];
    let id = $(elemento).attr("idUusuario");
    let idArchivo = $(elemento).attr("idArchivo")
    console.log(id)
    console.log(idArchivo);
    let parametros = {
        id,
        idArchivo
    }
    $.ajax({
        url: "/compartir",
        data: parametros,
        dataType: "json",
        method: "POST",
        success: function (respuestas) {
            console.log(respuestas);
        }
    })
})
$("#irCompartidos").click(function () {
    $.ajax({
        url: "/archivosCompartidos",
        method: "GET",
        success: function (respuestas) {
            for (respuesta of respuestas) {
                console.log(respuestas)
                $("#archivos").html("")
                $("#archivos").append(
                    `<div class="col-xl-4 col-lg-4 col-md-6 col-sm-10 col-12">
                <div class="card">
                <div class="card-header">
                ${respuesta.nombre_archivo}
                <span idArchivo=${respuesta.codigo_archivo} class="  darFavorito"><i class="far fa-star"></i></span>
              </div> 
                    <img class="card-img-top S" src="${respuesta.icono}.svg"width="125" height="125"  alt="Card image cap">
                    <div class="card-body text-center">
                        <button idActualizar=${respuesta.codigo_archivo} class="btn btn-info actualizar">Ver</button>
                    </div>
                    <div class="card-footer text-muted">
                    ${respuesta.fecha_creacion}
                  </div>
                </div>
            </div>`
                )
            }

        }
    })
});
$(document).on("click", ".descargar", function () {

})



/*$(document).on("click",".verArchivo",function(){
    let elemento=  $(this)[0];
    let id=$(elemento).attr("idBorrar");
    let parametros={id}
    $.ajax({
        url:"/eliminarArchivo",
        method:"get",
        data:parametros,
        dataType:"json",
        success:function(respuesta){
            console.log(respuesta);
        }
    })
  })*/

/*var elementoForm = document.getElementById("ingreso-oficio")
var formData = new FormData(elementoForm);
$.ajax({
    url:"/subirArchivo",
    method:"POST",
    data:formData,
    dataType: "json",
    success:function(respuesta){
        console.log(respuesta);
    }
})*/