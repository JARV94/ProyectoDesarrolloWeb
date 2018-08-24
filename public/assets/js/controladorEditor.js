$(document).ready(function(){
    var editor = CodeMirror.fromTextArea(document.getElementById("codeeditor"),
    {
        mode: "javascript",
        theme: "monokai",
        //tabSize:2,
        indentUnit: 3,
        lineNumbers: true,
        lineWrapping: true,
        extraKeys: { "Ctrl-Space": "autocomplete" },
        autoCloseTags: true
    });

    var boton = document.getElementById("boton");

boton.addEventListener("click", function () {

    let informacion = editor.getValue();
    let nombreArchivo=$("#nombre").val();
    editor.setValue("");
    parametros = {nombre:nombreArchivo ,
                informacion: informacion }
    $.ajax({
        url: "/editor",
        dataType: "json", 
        data: parametros,
        method: "POST",
        success: function (respuesta){
            window.location.href="/dashboard";
            //editor.setValue(respuesta.informacion);
            //te amo kellyn
        }
    })
});
})



/*
CodeMirror.modeURL = "mode/%N/%N.js";
var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
lineNumbers: true
});
var modeInput = document.getElementById("mode");
CodeMirror.on(modeInput, "keypress", function(e) {
if (e.keyCode == 13) change();
});
function change() {
var val = modeInput.value, m, mode, spec;
if (m = /.+\.([^.]+)$/.exec(val)) {
var info = CodeMirror.findModeByExtension(m[1]);
if (info) {
mode = info.mode;
spec = info.mime;
}
} else if (/\//.test(val)) {
var info = CodeMirror.findModeByMIME(val);
if (info) {
mode = info.mode;
spec = val;
}
} else {
mode = spec = val;
}
if (mode) {
editor.setOption("mode", spec);
CodeMirror.autoLoadMode(editor, mode);
document.getElementById("modeinfo").textContent = spec;
} else {
alert("Could not find a mode corresponding to " + val);
}
}*/
