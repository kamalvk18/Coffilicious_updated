var express = require("express");
var router  = express.Router();
var passport = require("passport")
var User   = require("../models/user");
const catchAsync = require('../utils/catchAsync')

router.get("/",function(req,res){
	res.render("home");
})

//SignUp

router.get("/signup",function(req,res){
	res.render("signup");
})

router.post("/signup",catchAsync(async (req,res,next)=>{
	try{
		// Creating a user instance without passing the password
		const user = new User({username: req.body.username})
		// Calling the register method provided by passport and sending the user instance and password
		const registeredUser = await User.register(user, req.body.password)
		req.login(registeredUser, err => {
			if(err) return next(err);
			req.flash("success","Welcome to Coffilicous "+req.user.username);
			res.redirect("/menu")
		})
	}catch(err){
		req.flash('error',err.message)
		res.redirect('signup')
	}
}))

// Login & Logout

router.get("/login",function(req,res){
	res.render("login");
})

router.post("/login",passport.authenticate("local",
{
	failureRedirect: "/login",
	failureFlash: true,
}),(req,res)=>{
	req.flash('success','Welcome back!')
	// redirecting to the page where the user was left off.
	const redirectUrl = req.session.returnTo || '/menu';
	delete req.session.returnTo
	res.redirect(redirectUrl)
});

router.get("/logout",function(req,res){
	req.logout();
	req.flash("success","See you again!")
	res.redirect("/menu");
});

router.get("/about",function(req,res){
	res.render("about");
});

module.exports = router;