let User = require("../models/user");

module.exports.registerUser = (req, res) => {
    res.render("auth/register.ejs");
}


module.exports.regUserPost = async (req, res, next) => {
    try {
        let { username, password, email } = req.body;
        let user = new User({ username, email })
        let regUser = await User.register(user, password)
        req.login(regUser, function (err) {
            if (err) return next(err);
            req.flash('success', 'welcome to yelpcamp');
            res.redirect("/campground");
        })

    } catch (e) {
        req.flash("error", e.message)
        res.redirect("/register");
    }
}

module.exports.loginUser =  (req, res) => {
    res.render("auth/login.ejs")
}


module.exports.fishy =  (req, res) => {
    req.flash("success", "welcome back");
    let redirectUrl = req.session.returnTo ||"/campground";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logoutUser = (req, res, next) => {
    req.logOut(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', "Good bye..!")
        res.redirect("/campground");
    })
}