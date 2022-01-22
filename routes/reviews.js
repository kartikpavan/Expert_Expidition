const express = require("express");
const router = express.Router({ mergeParams: true });
const Campground = require("../models/campground");
const Review = require("../models/review");

router.post("/", async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  const review = new Review(req.body.review);
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  req.flash("success", "Thanks for Submitting a Review!😄  ");
  res.redirect(`/campgrounds/${campground._id}`);
});

router.delete("/:reviewId", async (req, res) => {
  const { id, reviewId } = req.params;
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review Deleted successfully ");
  res.redirect(`/campgrounds/${id}`);
});

module.exports = router;
