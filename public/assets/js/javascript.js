$(document).ready(function () {
    $("#navbar2").hide();
    var posicionDrive = $("#logo").offset().top;
    var posicionContenido = $("#contenido").offset().top;
    $(window).scroll(function () {
        if ($(window).scrollTop() > posicionDrive) {
            $("#drive").hide("slow");
        } else {
            $("#drive").show("slow"); 
        }
    });
    $(window).scroll(function () {
        var posicionContenido = $("#contenido").offset().top;
        if ($(window).scrollTop() > posicionContenido) {
            //$("#imagenes").toggle("drop");
            $("#navbar").hide("slow");
            $("#navbar2").show("slow");
        }else{
            $("#navbar").show("slow");
            $("#navbar2").hide("slow");
        }
    });
    $("#arriba").click(function(){
       // $(window).scrollTop(0);
       $("body, html").animate({
           scrollTop:"650px"
       },2000);

    });
       $("#botonResponsive").click(function(){
           if ($("#navbar").hasClass("barra2")){
            $("#navbar").removeClass("barra2");
           }else{
            $("#navbar").addClass("barra2");
           }
           
       });
});