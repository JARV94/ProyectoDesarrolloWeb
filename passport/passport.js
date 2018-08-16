const LocalStrategy=require("passport-local").Strategy;
const mysql=require("mysql");
const bcrypt=require("bcrypt-nodejs");
//const passport=require("passport");

const conexion=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"db_usuarios"
});


module.exports = function(passport) {

	// =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
		done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
		conexion.query("select * from usuarios where id = "+id,function(err,rows){	
			done(err, rows[0]);
		});
    });
	

 	// =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
	// by default, if there was no name, it would just be called 'local'

    passport.use('registroLocal', new LocalStrategy({
        // by default, local strategy uses username and contrasena, we will override with correo
        usernameField : 'correo',
        passwordField : 'contrasena',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, correo, contrasena, done) {
        console.log(req.body);

		// find a user whose correo is the same as the forms correo
		// we are checking to see if the user trying to login already exists
        conexion.query("select * from usuarios where correo = '"+correo+"'",function(err,rows){
			//console.log(rows);
			//console.log("above row object");
			if (err)
                return done(err);
			 if (rows.length) {
                return done(null, false, req.flash('signupMessage', 'That correo is already taken.'));
            } else {

				// if there is no user with that correo
                // create the user
                var newUserMysql = new Object();
				
				newUserMysql.correo    = correo;
                newUserMysql.contrasena = bcrypt.hashSync(contrasena,bcrypt.genSaltSync(10));
                // use the generateHash function in our user model

			
				var insertQuery = "INSERT INTO usuarios ( correo, contrasena ) values ('" + correo +"','"+newUserMysql.contrasena  +"')";
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
            conexion.query("SELECT * FROM usuarios WHERE correo = ?",[correo], function(err, rows){
                if (err)
                    return done(err);
                if (!rows.length) {
                    return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
                }

                // if the user is found but the password is wrong
                if (!bcrypt.compareSync(contrasena, rows[0].contrasena))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

                // all is well, return successful user
                return done(null, rows[0]);
            });
        })
    );
}