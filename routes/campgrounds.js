const express = require("express");
const router = express.Router({ mergeParams: true });
const Campground = require("../models/campground");
const Review = require("../models/review");
const { isLoggedIn, isAuthor } = require("../middleware");

router.get("/", async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
});

router.get("/new", isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});

router.post("/", isLoggedIn, async (req, res, next) => {
  try {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash("success", "Successfuly Created New campground");
    res.redirect(`/campgrounds/${campground._id}`);
  } catch (e) {
    next(e);
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const campgrounds = await Campground.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("author");

  if (!campgrounds) {
    req.flash("error", "Uh oh , No Camps found ");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { campgrounds });
});

router.get("/:id/edit", isLoggedIn, isAuthor, async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash("error", "Camp does not exists");
    res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", { campground });
});

router.put("/:id", isLoggedIn, isAuthor, async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
  req.flash("success", "Successfully Updated Campground");
  res.redirect(`/campgrounds/${campground._id}`);
});

router.delete("/:id", isLoggedIn, isAuthor, async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash("success", "Campground DELETED");
  res.redirect("/campgrounds");
});

module.exports = router;
