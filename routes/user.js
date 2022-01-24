const express = require("express");
const passport = require("passport");
const router = express.Router({ mergeParams: true });

//CONTROLLER
const users = require("../controllers/users");

//ROUTES
router.get("/register", users.registerForm);
router.post("/register", users.register);

router.get("/login", users.loginForm);

//passport middleware
const passportMiddleware = passport.authenticate("local", {
  failureFlash: true,
  failureRedirect: "/login",
});

router.post("/login", passportMiddleware, users.login);
router.get("/logout", users.logout);

module.exports = router;
