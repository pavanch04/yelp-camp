let mongoose = require("mongoose")
let {Schema,model} = mongoose;
let User = require("./user");

let reviewSchema = new Schema({
    body : String,
    rating : Number,
    author : {
        type : Schema.Types.ObjectId,
        ref : "User"
    }
})

let Review = model("Review",reviewSchema);

module.exports = Review;