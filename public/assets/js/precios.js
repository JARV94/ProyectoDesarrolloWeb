$(document).ready(function(){
    var numero={numero:2}
    $.ajax({
        url:"/precios-obtenidos",
        method:"GET",
        data: numero,
        dataType:"json",
		success:function(respuesta){
            console.log(respuesta)
        }
    })
})