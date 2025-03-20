const mongoose = require("mongoose")
let {Schema,model} = mongoose
let passportLocalMongoose = require("passport-local-mongoose");


let userSchema = new Schema({
    email :{
        type:String,
        required:true,
        unique :true
    }
})

userSchema.plugin(passportLocalMongoose);
let User = model("User",userSchema);
module.exports = User;