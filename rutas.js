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
        res.render("Dashboard");
    });

    app.get("/login", function (req, res) {
        res.render("login");
    });

    app.get("/obtenerArchivos",isLoggedIn, function (req, res) {
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

    app.get("/papelera",isLoggedIn, function (req, res) {
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

    app.get("/contactos,",isLoggedIn, function (req, res) {
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

    app.get("/archivosCompartidos",isLoggedIn, function (req, res) {
        let usuario = req.session.passport.user
        conexion.query("SELECT A.codigo_archivo, nombre_archivo, icono, fecha_creacion, favorito, B.codigo_usuario_recibe FROM tbl_archivo A INNER JOIN tbl_archivo_compartido B ON(A.codigo_archivo=B.codigo_archivo) WHERE B.codigo_usuario_recibe=?", [usuario], function (error, resultado) {
            if (error) {
                throw error
            } else {
                console.log(resultado);
                res.send(resultado);
            }
        })
    });

    app.get("/actualizarArchivo",isLoggedIn, function (req, res) {
        // const {
        //     id
        // } = req.params;
        let id = req.session.idArchivo;
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
                        res.render("editorActualizar", {
                            nombre,
                            data
                        });
                    }
                })
            }
        })
    });

    app.post("/actualizarArchivo",isLoggedIn, function (req, res) {
        req.session.idArchivo = req.body.id;
        conexion.query("SELECT Archivo from tbl_archivo where codigo_archivo=?", [req.body.id], function (error, resultado) {
            if (error) {
                throw error;
            } else {
                req.session.Archivo = resultado[0].Archivo
                res.send({
                    estatus: 1
                });
            }
        })
    });

    app.post("/actualizar",isLoggedIn, function (req, res) {
        console.log(req.body);

        let usuario = req.session.passport.user;
        let archivo = req.session.Archivo
        let informacion = req.body.informacion;
        fs.writeFile(archivo, informacion, function (error) {
            if (error) {
                throw error
            } else {
                console.log("El archivo se actualizo exitosamente");
                res.send({
                    mensaje: "Se actualizo satisfavtoriamente"
                })
                /*var direccion = `uploads/${nombre}`;
                conexion.query("INSERT INTO tbl_archivo (codigo_propietario,nombre_archivo,Archivo,icono,fecha_creacion) VALUES (?,?,?,?,sysdate())", [usuario, nombrePost, direccion, iconoExtension], function (error, resultado) {
                    console.log(resultado);
                    if (error) {
                        throw error
                    } else {
                        res.send(resultado);
                    }
                });*/
            }
        });
    })

    app.get("/verFavoritos",isLoggedIn, function (req, res) {
        let usuario = req.session.passport.user;
        conexion.query("SELECT codigo_archivo, codigo_propietario, nombre_archivo, icono, fecha_creacion, favorito FROM tbl_archivo WHERE codigo_propietario=? AND favorito=?", [usuario, true], function (error, resultado) {
            if (error) {
                throw error
            } else {
                console.log(resultado);
                res.send(resultado);
            }
        })
    });

    app.get("/registro", function (req, res) {
        res.render("registro");
    });

    app.get("/precios", function (req, res) {
        res.render("precios");
    });

    app.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });

    app.post("/restaurar",isLoggedIn, function (req, res) {
        const {
            id
        } = req.body;
        conexion.query("UPDATE tbl_archivo set estado=? where codigo_archivo=?", [true, id], function (error, resultado) {
            if (error) {
                throw error
            } else {
                res.send()
            }
        })
    });

    app.post("/buscar",isLoggedIn, function (req, res) {
        const {
            buscar
        } = req.body;
        conexion.query("SELECT codigo_archivo, codigo_propietario, nombre_archivo, icono, fecha_creacion, favorito FROM tbl_archivo WHERE nombre_archivo codigo_propietario=? and estado=1 like'?%' ", [usuario, buscar], function (error, resultado) {
            if (error) {
                throw error;
            } else {
                console.log(resultado);
                res.send(resultado);
            }
        })
    });

    app.post("/compartir",isLoggedIn, function (req, res) {
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
                res.send()
            }
        })
    });

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
    });


    app.post("/login", passport.authenticate("local-login", {
        successRedirect: "/dashboard",
        failureRedirect: "/login",
        failureflash: true
    }));

    app.post("/eliminarTotalmente",isLoggedIn, function (req, res) {
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
                        conexion.query("DELETE FROM tbl_archivo_compartido WHERE codigo_archivo=?", [id], function (e, resultados) {
                            if (e) {
                                throw e;
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
                });
            }
        })
    });

    app.post("/eliminar",isLoggedIn, function (req, res) {
        let {
            id
        } = req.body;
        conexion.query("UPDATE tbl_archivo set estado=?, favorito=? where codigo_archivo=?", [false, false, id], function (error, resultado) {
            if (error) {
                throw error
            } else {
                res.send(resultado);
            }
        })
    });

    app.post("/favorito",isLoggedIn, function (req, res) {
        let {
            id,
            fav
        } = req.body;
        conexion.query("UPDATE tbl_archivo set favorito=? where codigo_archivo=?", [fav, id], function (error, resultado) {
            if (error) {
                throw error
            } else {
                console.log(resultado);
                res.send(resultado);
            }
        })
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


    app.get("/precios-obtenidos", function (req, res) {});

    app.post("/subirArchivo", function (req, res) {

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


}