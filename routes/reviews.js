const express = require("express");
const router = express.Router({ mergeParams: true });

//DATABASE MODELS
const Campground = require("../models/campground");
const Review = require("../models/review");

//MIDDLEWARE
const { isLoggedIn, isReviewAuthor } = require("../middleware");

//CONTROLLERS
const reviews = require('../controllers/reviews')

//ROUTES
router.post("/", isLoggedIn, reviews.postReview);
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, reviews.destroyReview);

module.exports = router;
