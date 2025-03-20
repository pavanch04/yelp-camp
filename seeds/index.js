let mongoose = require("mongoose");
// mongoose.connect().then(()=>{console.log("mongoose connected")}).catch(err => console.log(err));
let {cities} = require("./cities.js");
let Campground = require("../models/campgrnd.js");
let {descriptors,places} = require("./seedHelpers.js")

let sample = (arr) => arr[Math.floor(Math.random()*arr.length)];

let seedDB  = async() =>{
    await Campground.deleteMany({});
    for(let i=0;i<500;i++){
        let rand1000 = Math.floor(Math.random()*1000);
        let price = Math.floor(Math.random()*20) +10;
        let camp = new Campground({
            author:"666c73c074d7f4a8062c6cd0",
            location : `${cities[rand1000].city}, ${cities[rand1000].state}`,
            title : `${sample(descriptors)} ${sample(places)}`,
            description:"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Et delectus laborum fugit aut praesentium adipisci laboriosam facilis est nisi minus esse, labore ipsum qui veniam harum accusantium voluptatibus ",
            price,
            geometry: { 
               type: 'Point',
               coordinates: [ 
                cities[rand1000].longitude,
                cities[rand1000].latitude
                ] 
              },
            images : [
              {
                url: 'https://res.cloudinary.com/dyeayux62/image/upload/v1718372901/YelpCamp/zqpnjgeqwz9vqw4tzdvd.jpg',
                filename: 'YelpCamp/zqpnjgeqwz9vqw4tzdvd',
              },
              {
                url: 'https://res.cloudinary.com/dyeayux62/image/upload/v1718372903/YelpCamp/jn6bcxlwjh7lwyg0xuke.jpg',
                filename: 'YelpCamp/jn6bcxlwjh7lwyg0xuke',
              }
            ]
        }) 
        await camp.save();
    }
}

seedDB().then(()=>[
    mongoose.connection.close()
])





