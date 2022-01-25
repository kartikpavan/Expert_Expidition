const express = require("express");
const router = express.Router({ mergeParams: true });
//multer middleware for file uploading <--! CRUCIAl !--->
const { storage } = require("../cloudinary");
const multer = require("multer");
const upload = multer({ storage });
//Auth MIDDLEWARE
const { isLoggedIn, isAuthor } = require("../middleware");
//CONTROLLERS
const campgrounds = require("../controllers/campgrounds");

//ROUTES
router.get("/", campgrounds.index);
router.get("/new", isLoggedIn, campgrounds.newCampgroundForm);
router.post("/", isLoggedIn, upload.array("image"), campgrounds.createCampground);
router.get("/:id", campgrounds.showCampground);
router.get("/:id/edit", isLoggedIn, isAuthor, campgrounds.editCampgroundForm);
router.put("/:id", isLoggedIn, isAuthor, upload.array("image"), campgrounds.updateCampground);
router.delete("/:id", isLoggedIn, isAuthor, campgrounds.destroyCampground);

module.exports = router;
