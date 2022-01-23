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
    req.flash("success", "Welcome to Yelp Camp");
    res.redirect("/campgrounds");
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
  req.flash("success", "Welcome back");
  res.redirect("/campgrounds");
});

module.exports = router;
