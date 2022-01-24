const express = require("express");
const passport = require("passport");
const router = express.Router({ mergeParams: true });
const User = require("../models/user");

router.get("/register", (req, res) => {
  res.render("users/register");
});

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await new User({ username, email });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (e) => {
      if (e) return next(e);
      req.flash("success", `Welcome to Yelp Camp ${req.user.username}`);
      res.redirect("/campgrounds");
    });
  } catch (e) {
    // checking unique users get registerd , if same, then flash error
    req.flash("error", e.message);
    res.redirect("/register");
  }
});

router.get("/login", (req, res) => {
  res.render("users/login");
});

//passport middleware
const passportMiddleware = passport.authenticate("local", {
  failureFlash: true,
  failureRedirect: "/login",
});

router.post("/login", passportMiddleware, (req, res) => {
  req.flash("success", `Welcome back ${req.user.username}`);
  const redirecturl = req.session.returnTo || "/campgrounds";
  delete req.session.returnTo;
  res.redirect(redirecturl);
});

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "Successfully Logged you out.");
  res.redirect("/campgrounds");
});

module.exports = router;
