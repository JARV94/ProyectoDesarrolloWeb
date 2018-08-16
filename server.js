const express=require("express");
const app=express();
const hbs = require('hbs');
const path=require("path");
const passport=require("passport");
const cookieParser= require("cookie-parser");
const session=require("express-session");
const flash=require("connect-flash");

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

app.get("/",function(req,res){
    res.render("index")
});
app.get("/login",function(req,res){
    res.render("login");
});

app.post("/login",passport.authenticate("local-login",{
    successRedirect:"/precios",
    failureRedirect:"/login",
    failureflash:true
}))

app.get("/registro",function(req,res){
    res.render("registro");
});
app.get("/precios",isLoggedIn,function(req,res){
    res.render("precios");
});
app.post("/registro",passport.authenticate("registroLocal",{
    successRedirect:"/precios",
    failureRedirect:"/registro",
    failureflash:true
}));

function isLoggedIn (req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}

	res.redirect('/');
}

app.listen(3000,function(){
    console.log("Servidor iniciado");
});