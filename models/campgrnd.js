let mongoose = require("mongoose")
let Review = require("./review")
let User = require("./user");
// mongoose.connect('mongodb://127.0.0.1:27017/campgrndDB').then(
//     ()=>{console.log("connected to database")},
// ).catch(
//     (err)=>{console.log(err)}
// )
 let Schema = mongoose.Schema;
 let imageSchema = new Schema({
        url:String,
        filename: String
 })

imageSchema.virtual("thumbnail").get(function(){
   return this.url.replace("/upload","/upload/ar_1.0,c_fill,h_250")
})

const opts = {toJSON :{virtuals : true }}

 let campgroundSchema = new Schema({
    title: String,
    price:Number,
    description: String,
    geometry:{
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    author :{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    reviews : [
        {
            type: Schema.Types.ObjectId,
            ref : "Review"
        }
    ],
    images:[imageSchema],
    location:String
   
 },opts)

campgroundSchema.virtual("properties.popUpMarkup").get(function(){
    return `<strong><a href="/campground/${this._id}">${this.title}</a></strong>`;
 })

 campgroundSchema.post("findOneAndDelete",async function(campground){
    if(campground.reviews.length){
        let res = await Review.deleteMany({_id : {$in : campground.reviews}})
        console.log(res)
    }
 })
let Campground = mongoose.model("Campground",campgroundSchema);
 module.exports =  Campground;