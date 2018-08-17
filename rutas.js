
module.exports = (app,passport)=>{

    
    app.get("/",function(req,res){
        res.render("index")
    });
    app.get("/dashboard",isLoggedIn,function(req,res){
        console.log(req.session.passport);
        res.render("Dashboard");
    });
    app.get("/login",function(req,res){
        res.render("login");
    });
    
    app.post("/login",passport.authenticate("local-login",{
        successRedirect:"/dashboard",
        failureRedirect:"/login",
        failureflash:true
    }))
    
    
    app.get("/registro",function(req,res){
        res.render("registro");
    });
    app.get("/precios",function(req,res){
        
        res.render("precios");
    });
    app.post("/registro",passport.authenticate("registroLocal",{
        successRedirect:"/dashboard",
        failureRedirect:"/registro",
        failureflash:true
    }));
    
    function isLoggedIn (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
    
        res.redirect('/');
    }
    

    app.get("/precios-obtenidos",function(req,res){
        numero={numero:1}
        res.send(numero)
    });


    
    app.post("/subirArchivo",function(req,res){
        
    });
    app.get('/logout', (req, res) => {
		req.logout();
		res.redirect('/');
	});

}