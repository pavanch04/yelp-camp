let Campground = require("../models/campgrnd")
let Review = require("../models/review")
module.exports.postRev = async (req, res) => {
    let { id } = req.params;
    let campground = await Campground.findById(id);
    let review = new Review(req.body.reviews);
    review.author = req.user._id;
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    req.flash("success","successfully created new review.");
    res.redirect(`/campground/${campground._id}`);
}

module.exports.delRev = async (req, res) => {
    let {id,rid} = req.params;
    await Campground.findByIdAndUpdate(id,{$pull:{reviews: rid}});
    await Review.findByIdAndDelete(rid);
    req.flash("success","successfully deleted review.");
   
    res.redirect(`/campground/${id}`);
   
   
   }















