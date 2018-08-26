$(document).ready(function () {
    var editor = CodeMirror.fromTextArea(document.getElementById("codeeditor"), {
        mode: "javascript",
        theme: "monokai",
        //tabSize:2,
        indentUnit: 3,
        lineNumbers: true,
        lineWrapping: true,
        extraKeys: {
            "Ctrl-Space": "autocomplete"
        },
        autoCloseTags: true
    });
    $("#botonActualizar").click(function () {
        let informacion = editor.getValue();
        let nombreArchivo = $("#nombreActualizar").val();
        editor.setValue("");
        parametros = {
            nombre: nombreArchivo,
            informacion:informacion
        }
        $.ajax({
            url: "/actualizar",
            dataType: "json",
            data: parametros,
            method: "POST",
            success: function (respuesta) {
                window.location.href = "/dashboard";
    
            }
        })
    
    
    });
})
