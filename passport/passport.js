const local = require('passport-local').Strategy;
const mysql = require('mysql');
const bcrypt = require('bcrypt-nodejs');

//conexion a la BD
const conexion = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "db_jrcode"
});

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user.codigo_usuario);
    });
    passport.deserializeUser(function(id, done) {
        conexion.query("select * from tbl_usuario where codigo_usuario = ?",[id], function(err, rows) {
            done(err, rows[0]);
        });
    });
    passport.use('registroLocal', new local({
            usernameField: 'correo',
            passwordField: 'contrasena',
            passReqToCallback: true 
        },
        function(req, correo, contrasena, done) {
            conexion.query("select * from tbl_usuario where correo =?",[correo], function(err, rows) {
                console.log(rows);
                console.log("above row object");
                if (err)
                    return done(err);
                if (rows.length) {
                    return done(null, false, req.flash('signupMessage', 'El correo con el usuario ya existen'));
                } else {
                    var nuevoUsuario = new Object();

                    nuevoUsuario.correo = correo;
                    nuevoUsuario.contrasena = bcrypt.hashSync(contrasena, bcrypt.genSaltSync(10));

                    nuevoUsuario.nombre = req.body.nombre;
                    nuevoUsuario.codigo_almacenamiento = 1;


                    var insertQuery = "INSERT INTO tbl_usuario ( correo, password, nombre, codigo_almacenamiento) values (?,?,?,?)";
                    console.log(insertQuery);
                    conexion.query(insertQuery,[correo, nuevoUsuario.contrasena,nuevoUsuario.nombre,nuevoUsuario.codigo_almacenamiento], function(err, rows) {
                        nuevoUsuario.codigo_usuario = rows.insertId;

                        return done(null, nuevoUsuario);
                    });
                }
            });
        }));

    passport.use('local-login',
        new local({
                usernameField: 'correo',
                passwordField: 'contrasena',
                passReqToCallback: true 
            },
            function(req, correo, contrasena, done) { 
                conexion.query("SELECT * FROM tbl_usuario WHERE correo = ?", [correo], function(err, rows) {
                    if (err)
                        return done(err);
                    if (!rows.length) {

                        return done(null, false, req.flash('loginMessage', 'Usuario no encontrado')); 
                    }
                    console.log(rows[0]);
                    if (!bcrypt.compareSync(contrasena, rows[0].password))
                        return done(null, false, req.flash('loginMessage', 'contrasena incorrecta'));
                    return done(null, rows[0]);
                });
            })
    );
}