if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const path = require("path");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
// Passport Js
const passport = require("passport");
const localStrategy = require("passport-local");
// Routes
const campgroundsRouter = require("./routes/campgrounds");
const reviewRouter = require("./routes/reviews");
const userRouter = require("./routes/user");
const User = require("./models/user");
const MongoStore = require("connect-mongo");

//Mongo Atlas(Cloud) Connection
const dbUrl = process.env.DB_URL;
mongoose
  .connect(dbUrl)
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
//Implementing SESSION

const secret = process.env.SECRET || "lol";
app.use(
  session({
    name: "session",
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true, // httpOnly helps mitigate the risk of client side script accessing protected cookies
    },
    //Mongo-connect -> storing sessions in MONGO Database
    store: MongoStore.create({
      secret,
      mongoUrl: dbUrl,
      touchAfter: 24 * 3600,
    }),
  })
);
app.use(flash());

//PASSPORT MIDDLEWARE
app.use(passport.initialize());
app.use(passport.session());
// We are specifying which strategy will be used by Passport Js
passport.use(new localStrategy(User.authenticate())); // local Authentication
// telling passport on how to serialize a USER
passport.serializeUser(User.serializeUser()); // how to  store USER in SESSION
passport.deserializeUser(User.deserializeUser()); //  how to get USER out of that session

//GLOBAL MIDDLEWARES
app.use((req, res, next) => {
  res.locals.currentUser = req.user; //req.user is available to us by passport js
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.get("/", (req, res) => {
  res.render("home");
});

app.use("/campgrounds", campgroundsRouter);
app.use("/campgrounds/:id/reviews", reviewRouter);
app.use("/", userRouter);

//error handling
// app.use((err, req, res, next) => {
//   const { status = 500, message = "Something Went wrong" } = err;
//   res.status(status).send(message);
// });

// app.use((req, res, next) => {
//   res.status(404);
//   next();
// });

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Serving at ${port}`);
});
