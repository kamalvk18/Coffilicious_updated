var express 	  		  = require("express"),
    mongoose 	  		  = require("mongoose"),
    flash				  = require("connect-flash"),
	bodyParser    		  = require("body-parser"),
	passport	  		  = require("passport"),
	methodOverride   	  = require("method-override"),
	localStrategy 		  = require("passport-local"),
	passportLocalMongoose = require("passport-local-mongoose")
	
var app = express();
var coffee = require("./models/coffee");
var Review = require("./models/review")
var User   = require("./models/user")

var menuRoutes    = require("./routes/menu"),
	reviewRoutes  = require("./routes/reviews"),
	indexRoutes   = require("./routes/index")

const ExpressError = require("./utils/ExpressError")

var url = process.env.DATABASEURL||"mongodb://localhost/coffilicious"

mongoose.connect(url,{
	useNewUrlParser: true, 
	useUnifiedTopology: true,
	useCreateIndex: true,
	 useFindAndModify: false
 }).then(() => {
	console.log('Connected to DB!',url);
}).catch(err => {
	console.log('ERROR:', err.message);
});
//mongodb+srv://kamalvk18:kamal@123@cluster0-qdusk.mongodb.net/kamalvk18?retryWrites=true&w=majority
	
app.locals.moment = require("moment");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname+"/public"));
app.set("view engine","ejs");
app.use(methodOverride("_method"));

//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret :"Mustang is one of my dream car",
	resave :false,
	saveUninitialized :false
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

//Telling passport to use authenticate method on UserSchema
passport.use(new localStrategy(User.authenticate()));
//Serialization means how do we store user in the session
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error= req.flash("error");
	res.locals.success=req.flash("success");
	next();
});

app.use("/",indexRoutes)
app.use("/menu/:id/review",reviewRoutes)
app.use("/menu",menuRoutes)

app.all('*',(req,res,next)=>{
	next(new ExpressError('Page not Found!!',404))
})

app.use(function(err, req, res, next) {
	if(!err.message){
		err.message = "Something went wrong!"
	}
	if(!err.statusCode){
		err.statusCode = 500
	}
	const {statusCode, message} = err
	res.status(statusCode).render('error',{err})
});

app.listen(process.env.PORT||3000,function(){
	console.log("Server Started...");
})