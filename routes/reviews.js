var express = require("express");
var router  = express.Router({mergeParams: true});
var Review = require("../models/review");
var coffee = require("../models/coffee")
var middleware = require("../middleware");

const catchAsync = require("../utils/catchAsync")

router.get("/new",middlewareObj.isLoggedIn,function(req,res){
	coffee.findById(req.params.id,function(err,foundCoffee){
		if(err){
			console.log(err);
		}
		else{
			res.render("reviews/new", {coffee: foundCoffee});
		}
	})
})

router.post("/",middlewareObj.isLoggedIn,catchAsync(async (req,res)=>{
	const {id} = req.params
	const foundCoffee = await coffee.findById(id)
	const review = new Review(req.body.review)
	review.author.id = req.user._id
	review.author.username=req.user.username;
	await review.save();
	foundCoffee.reviews.push(review);
	await foundCoffee.save();
	res.redirect("/menu/"+ foundCoffee._id)
}));

router.get("/:reviewId/edit",middlewareObj.reviewOwnership,function(req,res){
	coffee.findById(req.params.id,function(err,foundCoffee){
		if(err){
			res.redirect("back")
		}
		else{
			Review.findById(req.params.reviewId,function(err,foundReview){
			if(err){
				res.redirect("back")
			}	
			else{
				res.render("reviews/edit",{review:foundReview, coffee:foundCoffee})
			}
		})		
	}
})
})

router.put("/:reviewId",middlewareObj.reviewOwnership,function(req,res){
	Review.findByIdAndUpdate(req.params.reviewId,req.body.review,function(err,foundReview){
		if(err){
			console.log(err);
		}
		else{
			res.redirect("/menu/"+req.params.id)
		}
	})
})

router.delete("/:reviewId",middlewareObj.reviewOwnership,function(req,res){
	Review.findByIdAndRemove(req.params.reviewId,function(err){
		if(err){
			res.redirect("back")
		}else{
			res.redirect("/menu/"+req.params.id);
		}
	})
})

module.exports = router;