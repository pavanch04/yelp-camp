if(process.env.NODE_ENV!=="production"){
    require("dotenv").config()
}


//reqirements



let express = require("express");
let app = express();
let { cgSchema, revSchema } = require("./schemas.js");
let {isLoggedIn,isAuthor,joiVal} = require("./middleware.js");
let AppErr = require("./utils/AppErr.js")
let path = require("path");
let wrapAsync = require("./utils/wrapAsync.js");
let mongoose = require("mongoose");
let methodOverride = require("method-override");
 //'mongodb://127.0.0.1:27017/campgrndDB'
// process.env.DB_URL 
 let dbUrl =  process.env.DB_URL || 'mongodb://127.0.0.1:27017/campgrndDB'

mongoose.connect(dbUrl
, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Successfully connected to MongoDB');
    })
    .catch(err => {
        console.error('Connection error', err);
    });
let Campground = require("./models/campgrnd.js")
let Review = require("./models/review.js")
let campgrndRoute = require("./routes/campgrounds.js")
let reviewRoute = require("./routes/reviews.js");
let ejsMate = require("ejs-mate");
let flash = require("connect-flash")
let passport = require("passport")
let LocalStrategy = require("passport-local").Strategy;
let User = require("./models/user.js");
const userRoute = require("./routes/users.js")
const mongoSanitize = require('express-mongo-sanitize');
let helmet = require("helmet")
let session = require("express-session");
const MongoStore = require("connect-mongo");


//setting

app.engine("ejs", ejsMate);
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"))
app.use(express.static(path.join(__dirname, "public")));



let store = MongoStore.create({
    mongoUrl : dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto : {
        secret: "thisshouldbeabettersecret",
    }
})

store.on("error",function(e){
    console.log("SESSION STORE ERROR",e)
})

app.use(session(
    {
        store: store,
        secret: 'thisshouldbeabettersecret',
        name :'session',
        saveUninitialized: true,
        resave: false,
        cookie: {
            httpOnly: true,
            // secure :true,
            expires: Date.now() + (1000 * 60 * 60 * 24 * 7),
            maxAge: 1000 * 60 * 60 * 24 * 7
        }

    }))
app.use(flash())
app.use(mongoSanitize({
    replaceWith: '_',
}))
app.use(helmet())



const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [
    "https://cdn.jsdelivr.net",  // Added jsDelivr to fontSrcUrls
];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dyeayux62/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);





app.use(passport.initialize());
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {

    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})


//export routes

app.use("/campground", campgrndRoute);
app.use("/campground/:id/reviews", reviewRoute);
app.use("/", userRoute)

//internal routes

app.get("/",(req, res) => {
    res.render("home.ejs");
})

app.get("/fake", async (req, res) => {
    let user = new User({ email: "danyxxx@gmail.com", username: 'dany' })
    let newUser = await User.register(user, "danyxxx");
    res.send(newUser);
})

app.all("*", (req, res, next) => {
    next(new AppErr("Page not found", 404));
})



app.use((err, req, res, next) => {
    let { status = 500 } = err;
    if (!err.message) err.message = "oh no something went wrong..!";
    res.status(status).render("error.ejs", { err })
})


app.listen(3000, () => {
    console.log("Server is running on port 3000")
})