const User = require("../models/user");

module.exports.registerForm = (req, res) => {
  res.render("users/register");
};

module.exports.register = async (req, res) => {
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
};

module.exports.loginForm = (req, res) => {
  res.render("users/login");
};

module.exports.login = (req, res) => {
  req.flash("success", `Welcome back ${req.user.username}`);
  const redirecturl = req.session.returnTo || "/campgrounds";
  delete req.session.returnTo;
  res.redirect(redirecturl);
};
module.exports.logout = (req, res) => {
  req.logout();
  req.flash("success", "Successfully Logged you out.");
  res.redirect("/campgrounds");
};
