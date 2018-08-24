const express=require("express");
const app=express();
const hbs = require('hbs');
const path=require("path");
const passport=require("passport");
const cookieParser= require("cookie-parser");
const session=require("express-session");
const flash=require("connect-flash");
const fs=require("fs");

require("./passport/passport")(passport);
app.use(express.static(path.join(__dirname,"public")));
//pathPublic=path.join(__dirname,"public")
//hbs.registerPartials(path.join(pathPublic,"parciales"));
app.set("view engine","hbs");


//middlewares
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));
app.use(session({
    secret:"jeffersonReyesVallejo",
    resave:false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//rutas
require("./rutas.js")(app,passport);
app.use(require("./upload.js"));



app.listen(3000,function(){
    console.log("Servidor iniciado");
}); 