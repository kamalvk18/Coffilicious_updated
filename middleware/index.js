middlewareObj={}
var Review = require("../models/review.js")

middlewareObj.reviewOwnership = function(req,res,next){
	if(req.isAuthenticated){
		Review.findById(req.params.reviewId,function(err,foundReview){
			if(err){
				res.redirect("back")
			}
			else{
				if(foundReview.author.id.equals(req.user._id)){
					next();
				}
				else{
					res.redirect("back")
				}
			}
		})
	}
	else{
		res.redirect("back")
	}
}
middlewareObj.isLoggedIn = function(req,res,next){
	if(req.isAuthenticated()){
	   return next()
	   }
	req.session.returnTo = req.originalUrl
	req.flash("error","Please Login First");
	res.redirect("/login")
}

module.exports = middlewareObj;