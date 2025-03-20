let express = require("express")
let router = express.Router({mergeParams:true});
let wrapAsync = require("../utils/wrapAsync.js");
let {reValtn,isLoggedIn,isRevAuthor} = require("../middleware.js");
let reviews = require("../controllers/reviews.js")








router.post("/", isLoggedIn,reValtn, wrapAsync(reviews.postRev))

router.delete("/:rid", isLoggedIn,isRevAuthor,wrapAsync(reviews.delRev))


module.exports = router;