let Campground = require("../models/campgrnd")
const {cloudinary} = require("../cloudinary")
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const lib = require("connect-flash");
let mapBoxToken = process.env.MAPBOX_TOKEN;
let geocoder = mbxGeocoding({accessToken : mapBoxToken})




module.exports.index = async (req, res) => {
    let campgrounds = await Campground.find({})
    res.render("campgrounds/index.ejs", { campgrounds })
}
 
module.exports.newForm = async (req, res) => {
    res.render("campgrounds/new.ejs");
}


module.exports.newCamp =async (req, res, next) => {
   const geoData = await geocoder.forwardGeocode({
    query : req.body.campground.location,
    limit : 1
    }).send()
    let camp = new Campground(req.body.campground);
    camp.geometry = geoData.body.features[0].geometry;
    camp.images =req.files.map(f =>({url:f.path,filename:f.filename}))
    camp.author = req.user._id;
    await camp.save();
    req.flash("success","Successfully added a new Campground.");
    res.redirect(`/campground/${camp._id}`);
}


module.exports.showCamp = async (req, res) => {
    let { id } = req.params;
    let campground = await Campground.findById(id).populate({
        path:"reviews",
        populate :{
            path : "author"
        }
    }).populate("author");
    if(!campground){
        req.flash("error","cant find campground")
        return res.redirect("/campground")
    }
    console.log(campground);
    res.render("campgrounds/show.ejs", {campground})
}

module.exports.renderEdit = async (req, res) => {
    let { id } = req.params;
    let campground = await Campground.findById(id);
    if(!campground){
        req.flash("error","cant find campground")
        return res.redirect("/campground")
    }
    
    res.render("campgrounds/edit.ejs", { campground })
}

module.exports.realEdit = async (req, res) => {
    let { id } = req.params;
    console.log(req.body);
    let campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground },{new:true});
    let imgs = req.files.map(f =>({url:f.path,filename:f.filename}))
    campground.images.push(...imgs);
    await campground.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
          await  cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({$pull : {images:{filename:{$in: req.body.deleteImages}}}})
        console.log(campground);
    }
    req.flash("success","Successfully updated The Campground.");
    res.redirect(`/campground/${campground._id}`);
}


module.exports.delCamp = async (req, res) => {
    let { id } = req.params;
    let campground = await Campground.findByIdAndDelete(id);

    req.flash("success","successfully deleted campground.");

    res.redirect(`/campground`);
}