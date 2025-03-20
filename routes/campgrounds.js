let express = require("express")
let router = express.Router({mergeParams:true});
let wrapAsync = require("../utils/wrapAsync")
let {isLoggedIn,isAuthor,joiVal} = require("../middleware.js");
let campgrounds = require("../controllers/campgrounds.js")
const multer  = require('multer')
const {storage} = require("../cloudinary")
const upload = multer({ storage })


router.route("/")
.get( wrapAsync(campgrounds.index))
.post(isLoggedIn,upload.array("image"),joiVal, wrapAsync(campgrounds.newCamp))



router.get("/new", isLoggedIn,wrapAsync(campgrounds.newForm))

router.route("/:id")
.get(wrapAsync(campgrounds.showCamp))
.put(isLoggedIn,isAuthor,upload.array("image"),joiVal,wrapAsync(campgrounds.realEdit))
.delete(isAuthor,wrapAsync(campgrounds.delCamp));


router.get("/:id/edit",isLoggedIn,isAuthor,wrapAsync(campgrounds.renderEdit))



module.exports = router;