var mongoose = require("mongoose")

var coffeeSchema = new mongoose.Schema({
	name: String,
	image: String,
	price: Number,
	desc : String,
	reviews : [{
		type:mongoose.Schema.Types.ObjectId,
		ref:"Review"
	}]
});

module.exports = mongoose.model("Coffee",coffeeSchema)