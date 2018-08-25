const fs = require("fs");
const mysql = require("mysql");
const path = require("path");
 //const express = require("express");
 //const app = express();



const conexion = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "db_jrcode"
});




module.exports = (app, passport) => {


    app.get("/", function (req, res) {
        res.render("index")
    });
    app.get("/dashboard", isLoggedIn, function (req, res) {
        console.log(req.session.passport);
        console.log(req.user);
        res.render("Dashboard");
    });
    app.get("/login", function (req, res) {
        res.render("login");
    });
    app.get("/obtenerArchivos", function (req, res) {
        let usuario = req.session.passport.user;
        conexion.query("SELECT codigo_archivo, codigo_propietario, nombre_archivo, icono, fecha_creacion, favorito FROM tbl_archivo WHERE codigo_propietario=? and estado=1 ", [usuario], function (error, resultado) {
            console.log(resultado);
            if (error) {
                throw error;
            } else {
                res.send(resultado)
            }
        })
    })
//ya
    app.get("/papelera",function(req,res){
        let usuario = req.session.passport.user;
        conexion.query("SELECT codigo_archivo, codigo_propietario, nombre_archivo, icono, fecha_creacion, favorito FROM tbl_archivo WHERE estado=0 and codigo_propietario=?", [usuario], function (error, resultado) {
            console.log(usuario);
            console.log(resultado);
            if (error) {
                throw error;
            } else {
                res.send(resultado)
            }
        })
    });

    //ya
    app.post("/restaurar",function(req,res){
        const {id}=req.body;
        conexion.query("UPDATE tbl_archivo set estado=? where codigo_archivo=?",[true,id],function(error,resultado){
            if (error){
                throw error
            }else{
                console.log(resultado);
            }
        })
    })


    app.get("/contactos", function (req, res) {
        usuario = req.session.passport.user;
        conexion.query("SELECT * FROM TBL_USUARIO", function (error, resultado) {
            if (error) {
                throw error;
            } else {
                console.log(resultado);
                res.send(resultado);
            }
        })
    });

    app.get("/editor", isLoggedIn, (req, res) => {
        res.render("editor");
    });
    app.post("/compartir", function (req, res) {
        let codigoPropietario = req.session.passport.user;
        let {
            id,
            idArchivo
        } = req.body;
        conexion.query("INSERT INTO tbl_archivo_compartido (codigo_propietario, codigo_archivo, codigo_usuario_recibe,fecha_compartir) VALUES (?,?,?,sysdate())", [codigoPropietario, idArchivo, id], function (error, resultado) {
            if (error) {
                throw error
            } else {
                console.log(resultado);
            }
        })
    })

    app.get("/archivosCompartidos", function (req, res) {
        let usuario = req.session.passport.user
        conexion.query("SELECT A.codigo_archivo, nombre_archivo, icono, fecha_creacion, favorito, B.codigo_usuario_recibe FROM tbl_archivo A INNER JOIN tbl_archivo_compartido B ON(A.codigo_archivo=B.codigo_archivo) WHERE B.codigo_usuario_recibe=?", [usuario], function (error, resultado) {
            if (error){
                throw error
            }else{
                console.log(resultado);
                res.send(resultado);
            }
        })
    })

    app.post("/editor", isLoggedIn, (req, res) => {
        console.log(req.body);
        let usuario = req.session.passport.user;
        let nombrePost = req.body.nombre;
        let informacion = req.body.informacion;
        let nombreArchivo = nombrePost.split(".");
        let extension = nombreArchivo[nombreArchivo.length - 1];
        let nombre = `${nombreArchivo[0]}_${new Date().getMilliseconds()}.${extension}`;
        let iconoExtension = `iconos/${extension}`
        fs.appendFile(`uploads/${nombre}`, informacion, function (error) {
            if (error) throw error
            console.log("El archivo a sido creado exitosamente");
        });
        var direccion = `uploads/${nombre}`;
        conexion.query("INSERT INTO tbl_archivo (codigo_propietario,nombre_archivo,Archivo,icono,fecha_creacion) VALUES (?,?,?,?,sysdate())", [usuario, nombrePost, direccion, iconoExtension], function (error, resultado) {
            console.log(resultado);
            if (error) {
                throw error
            } else {
                res.send(resultado);
            }
        });
    })


    app.post("/login", passport.authenticate("local-login", {
        successRedirect: "/dashboard",
        failureRedirect: "/login",
        failureflash: true
    }))
    app.post("/eliminarTotalmente", function (req, res) {
        let {
            id
        } = req.body;
        conexion.query("Select codigo_archivo,Archivo from tbl_archivo where codigo_archivo=?", [id], function (Erro, resultado) {
            if (Erro) {
                throw Erro;
            } else {
                let archivo = resultado[0].Archivo;
                //res.send({direccion:archivo});
                fs.unlink(archivo, function (err) {
                    if (err) {
                        throw err
                    } else {
                        conexion.query("DELETE FROM tbl_archivo WHERE codigo_archivo=?", [id],
                            function (error, result) {
                                if (error) {
                                    throw error
                                } else {
                                    res.send({
                                        informacion: "Archivo borrado exitosamente"
                                    });
                                }
                            })
                    }
                });
            }
        })
    })
//ya
    app.post("/eliminar", function (req, res) {
        let {
            id
        } = req.body;
        conexion.query("UPDATE tbl_archivo set estado=?, favorito=? where codigo_archivo=?",[false,false,id],function(error,resultado){
            if (error){
                throw error
            }else{
                console.log(resultado);
            }
        })
    })


    app.get("/actualizarArchivo/:id", function (req, res) {
        const {
            id
        } = req.params;
        conexion.query("Select codigo_archivo, nombre_archivo ,Archivo from tbl_archivo where codigo_archivo=?", [id], function (error, resultado) {
            if (error) {
                throw error;
            } else {
                let archivo = resultado[0].Archivo;
                let nombre = resultado[0].nombre_archivo;
                console.log(archivo);
                fs.readFile(archivo, function (error, data) {
                    if (error) {
                        throw error;
                    } else {
                        data = data.toString()
                        res.render("editorActualizar");
                    }
                })
            }
        })
    });

    app.get("/actualizarArchivo", function (req, res) {

    });

    app.post("/favorito", function (req, res) {
        let {
            id,
            fav
        } = req.body;
        conexion.query("UPDATE tbl_archivo set favorito=? where codigo_archivo=?", [fav, id], function (error, resultado) {
            if (error) {
                throw error
            } else {
                console.log(resultado);
            }
        })
    })
    app.get("/verFavoritos", function (req, res) {
        let usuario = req.session.passport.user;
        conexion.query("SELECT codigo_archivo, codigo_propietario, nombre_archivo, icono, fecha_creacion, favorito FROM tbl_archivo WHERE codigo_propietario=? AND favorito=?", [usuario, true], function (error, resultado) {
            if (error) {
                throw error
            } else {
                console.log(resultado);
                res.send(resultado);
            }
        })
    })

    app.get("/registro", function (req, res) {
        res.render("registro");
    });

    app.get("/precios", function (req, res) {

        res.render("precios");
    });

    app.post("/registro", passport.authenticate("registroLocal", {
        successRedirect: "/dashboard",
        failureRedirect: "/registro",
        failureflash: true
    }));

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }

        res.redirect('/');
    }


    app.get("/precios-obtenidos", function (req, res) {
        numero = {
            numero: 1
        }
        res.send(numero)
    });

   /* app.post("/descargar",function(req,res){

        res.download(__dirname+"/uploads/prueba_752.php","prueba_752.php",function(error){
            if (error){
                throw error;
            }else{
                console.log("se ha descargado")
            }
        })
    });*/



    app.post("/subirArchivo", function (req, res) {

    });
    app.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });

}