const express = require("express");
const router = express.Router({ mergeParams: true });
//Auth MIDDLEWARE
const { isLoggedIn, isAuthor } = require("../middleware");
//CONTROLLERS
const campgrounds = require("../controllers/campgrounds");

//ROUTES
router.get("/", campgrounds.index);

router.get("/new", isLoggedIn, campgrounds.newCampgroundForm);

router.post("/", isLoggedIn, campgrounds.createCampground);

router.get("/:id", campgrounds.showCampground);

router.get("/:id/edit", isLoggedIn, isAuthor, campgrounds.editCampgroundForm);

router.put("/:id", isLoggedIn, isAuthor, campgrounds.updateCampground);

router.delete("/:id", isLoggedIn, isAuthor, campgrounds.destroyCampground);

module.exports = router;
