const express = require("express");
const router = express.Router({ mergeParams: true });
const Campground = require("../models/campground");
const Review = require("../models/review");

router.get("/", async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
});

router.get("/new", (req, res) => {
  // if (!req.isAuthenticated()) {
  //   req.flash("error", "You must be signed In");
  //   return res.redirect("/login");
  // }
  res.render("campgrounds/new");
});

router.post("/", async (req, res, next) => {
  try {
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash("success", "Successfuly Created New campground");
    res.redirect(`/campgrounds/${campground._id}`);
  } catch (e) {
    next(e);
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const campgrounds = await Campground.findById(id).populate("reviews");
  if (!campgrounds) {
    req.flash("error", "Uh oh , No Camps found ");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { campgrounds });
});

router.get("/:id/edit", async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  res.render("campgrounds/edit", { campground });
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
  req.flash("success", "Successfully Updated Campground");
  res.redirect(`/campgrounds/${campground._id}`);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash("success", "Campground DELETED");
  res.redirect("/campgrounds");
});

module.exports = router;
