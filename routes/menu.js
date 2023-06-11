var express = require("express");
var router  = express.Router({mergeParams: true});
var coffee = require("../models/coffee");
var middleware = require("../middleware");

const catchAsync = require("../utils/catchAsync")

router.get("/",function(req,res){
	coffee.find({},function(err,coffees){
		if(err){
			console.log("cannot load");
		}
		else{
			res.render("coffee/menu",{coffee : coffees});	
		}
	})	
})

router.post("/", catchAsync(async function(req,res){
	await coffee.create(req.body)
	req.flash('success','Coffee Added!')
	res.redirect("/menu")
}))

router.put("/:id",catchAsync(async function(req,res){
	const {id} = req.params
	const editCoffee = await coffee.findByIdAndUpdate(id,req.body)
	console.log(editCoffee)
	res.redirect("/menu")
}))

router.delete("/:id",catchAsync(async function(req,res){
	const {id} = req.params
	const deleteCoffee = await coffee.findByIdAndDelete(id)
	req.flash('success','Coffee deleted!')
	res.redirect("/menu")
}))

router.get("/new",function(req,res){
	res.render("coffee/new")
})


router.get("/:id", middlewareObj.isLoggedIn, catchAsync(async function(req,res){
	const foundCoffee = await coffee.findById(req.params.id).populate('reviews')
	res.render("coffee/show", {coffee: foundCoffee});
}))

router.get('/:id/edit', middlewareObj.isLoggedIn, catchAsync(async function(req,res){
	const {id} = req.params
	const foundCoffee = await coffee.findById(id)
	res.render("coffee/edit",{coffee:foundCoffee})
}))

module.exports = router;