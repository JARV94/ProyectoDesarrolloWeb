const express=require("express");
const app=express();
const fileUpload = require('express-fileupload');
const mysql=require("mysql");
app.use(fileUpload());
const conexion=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"db_jrcode"
});

app.post('/upload', function(req, res){ 
    if (!req.files)
    return res.status(400).send('No files were uploaded.');

    //.samplefile es el name del input que carga la imagen
    let archivo = req.files.archivo;
    nombreArchivo=archivo.name.split(".");
    let extension=nombreArchivo[nombreArchivo.length-1];

    let extensionespermitidas=["jpg","png","gif","jpeg"];

    if(extensionespermitidas.indexOf(extension)<0){
        return res.send("extension no valida");
    }

    let nombre=`${archivo.name}_${new Date().getMilliseconds()}.${extension}`

    archivo.mv(`uploads/${nombre}`, function(err) {
        if (err)
          return res.status(500).send(err);
     
        //res.send('File uploaded!');
        var direccion=`uploads/${nombre}`;
        conexion.query("INSERT INTO tbl_archivo (codigo_propietario,nombre_archivo,Archivo,fecha_creacion) VALUES (?,?,?,sysdate())",[2,archivo.name,direccion],function(error,resultado){
            console.log(resultado);
            if (error){
                throw error
            }else{
                res.send(resultado);
            }
        })
      });
})

module.exports=app;