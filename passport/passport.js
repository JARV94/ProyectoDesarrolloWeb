const LocalStrategy=require("passport-local").Strategy;
const mysql=require("mysql");
const bcrypt=require("bcrypt-nodejs");
//const passport=require("passport");

const conexion=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"db_jrcode"
});


module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
		done(null, user.codigo_usuario);
    });
    passport.deserializeUser(function(id, done) {
		conexion.query("select * from tbl_usuario where codigo_usuario = "+id,function(err,rows){	
			done(err, rows[0]);
		});
    });
	

    passport.use('registroLocal', new LocalStrategy({
        usernameField : 'correo',
        passwordField : 'contrasena',
        passReqToCallback : true 
    },
    function(req, correo, contrasena, done) {
        console.log(req.body);


        conexion.query("select * from tbl_usuario where correo = '"+correo+"'",function(err,rows){
	
			if (err)
                return done(err);
			 if (rows.length) {
                return done(null, false, req.flash('signupMessage', 'That correo is already taken.'));
            } else {

                var newUserMysql = new Object();
				
                newUserMysql.correo    = correo;
                newUserMysql.nombre=req.body.nombre
                newUserMysql.contrasena = bcrypt.hashSync(contrasena,bcrypt.genSaltSync(10));
                newUserMysql.codigo_almacenamiento=1

				var insertQuery = "INSERT INTO tbl_usuario ( correo, password,nombre,codigo_almacenamiento) values ('" + correo +"','"+newUserMysql.contrasena  +"','" + newUserMysql.nombre +"','" + newUserMysql.codigo_almacenamiento +"')";
					console.log(insertQuery);
				conexion.query(insertQuery,function(err,rows){
				newUserMysql.id = rows.insertId;
				
				return done(null, newUserMysql);
				});	
            }	
		});
    }));

    passport.use(
        'local-login',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'correo',
            passwordField : 'contrasena',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, correo, contrasena, done) { // callback with email and password from our form
            conexion.query("SELECT * FROM tbl_usuario WHERE correo = ?",[correo], function(err, rows){
                if (err)
                    return done(err);
                if (!rows.length) {
                    return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
                }

                // if the user is found but the password is wrong
                if (!bcrypt.compareSync(contrasena, rows[0].password))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

                // all is well, return successful user
                return done(null, rows[0]);
            });
        })
    );
}