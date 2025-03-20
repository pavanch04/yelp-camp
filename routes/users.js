const express = require('express')
let router = express.Router({ mergeParams: true });
let User = require("../models/user");
let wrapAsync = require("../utils/wrapAsync");
let passport = require("passport")
const { storeReturnTo } = require('../middleware');
let users = require("../controllers/users")
router.route("/register")
.get(users.registerUser)
.post(wrapAsync(users.regUserPost))

router.route("/login")
.get(users.loginUser)
.post(storeReturnTo,passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }),users.fishy)

router.get("/logout", users.logoutUser);

module.exports = router;
