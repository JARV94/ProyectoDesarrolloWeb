$(document).ready(function(){
    var elementoForm = document.getElementById("ingreso-oficio")
    var formData = new FormData(elementoForm);
    $.ajax({
        url:"/subirArchivo",
        method:"POST",
        data:formData,
        dataType: "json",
        success:function(respuesta){
            console.log(respuesta);
        }
    })
})