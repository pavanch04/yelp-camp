let passport =require("passport")
let flash = require("connect-flash")
let session = require("express-session");
let { cgSchema,revSchema} = require("./schemas.js");
let AppErr = require("./utils/AppErr.js")
let Campground = require("./models/campgrnd.js")
let Review = require("./models/review.js");


module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl
        req.flash("error","you must sign in");
        return res.redirect("/login");
    }
    next();
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.isAuthor = async(req,res,next)=>{
    let {id} = req.params;
    let camp = await Campground.findById(id);
    if(!camp.author.equals(req.user._id)){
        req.flash("error","you dont have permission to do that");
        return res.redirect(`/campground/${id}`);
    }
    next();
}

module.exports.isRevAuthor = async(req,res,next)=>{
    let {id,rid} = req.params;
    let review = await Review.findById(rid);
    if(!review.author.equals(req.user._id)){
        req.flash("error","you dont have permission to do that");
        return res.redirect(`/campground/${id}`);
    }
    next();
}

module.exports.joiVal = (req, res, next) => {
    let { error } = cgSchema.validate(req.body)
    if (error) {
        let msg = error.details.map(el => el.message).join(",")
        console.log(error)
        throw new AppErr(msg, 404)
    } else {
        next();
    }
}

module.exports.reValtn = (req, res, next) => {
    let { error } = revSchema.validate(req.body)
    console.log(`in schema ${error}`)
    if (error) {
        let msg = error.details.map(el => el.message).join(",")
        console.log(error)
        throw new AppErr(msg, 404)
    } else {
        next();
    }
}