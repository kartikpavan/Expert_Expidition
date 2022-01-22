const express = require("express");
const path = require("path");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const campgroundsRouter = require("./routes/campgrounds");
const reviewRouter = require("./routes/reviews");
const session = require("express-session");
const flash = require("connect-flash");

mongoose
  .connect("mongodb://localhost:27017/hillsideCreek")
  .then(() => {
    console.log("MongoDb Connection Established");
  })
  .catch((err) => {
    console.log("oh uh !! something went wrong");
    console.log(err);
  });

app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.use(
  session({
    secret: "LOL",
    resave: false,
    saveUninitialized: true,
    cookie: {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      httpOnly: true, // httpOnly helps mitigate the risk of client side script accessing protected cookies
    },
  })
);
app.use(flash());
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.get("/", (req, res) => {
  res.render("home");
});

app.use("/campgrounds", campgroundsRouter);
app.use("/campgrounds/:id/reviews", reviewRouter);

app.listen(3000, () => {
  console.log("Serving on localhost:3000");
});
