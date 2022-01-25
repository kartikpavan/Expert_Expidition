const Campground = require("../models/campground");
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
};

module.exports.newCampgroundForm = (req, res) => {
  res.render("campgrounds/new");
};

module.exports.createCampground = async (req, res, next) => {
  try {
    const campground = new Campground(req.body.campground);
    campground.image = req.files.map((f) => ({ url: f.path, filename: f.filename }));
    campground.author = req.user._id;
    await campground.save();
    console.log(campground);
    req.flash("success", "Successfuly Created New campground");
    res.redirect(`/campgrounds/${campground._id}`);
  } catch (e) {
    next(e);
  }
};

module.exports.showCampground = async (req, res) => {
  const { id } = req.params;
  const campgrounds = await Campground.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("author");

  if (!campgrounds) {
    req.flash("error", "Uh oh , No Camps found ");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { campgrounds });
};

module.exports.editCampgroundForm = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash("error", "Camp does not exists");
    res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", { campground });
};

module.exports.updateCampground = async (req, res) => {
  const { id } = req.params;
  console.log(req.body);
  const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
  const img = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  campground.image.push(...img); // we are nor overriting existing image , we are just pushing more images.
  //So thats y SPREAD OPERATOR IS USED HERE
  await campground.save();
  if (req.body.deleteImages) {
    //deleting the images from cloudinary API where our images are stored!
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    //deleting images from edit page
    await campground.updateOne({ $pull: { image: { filename: { $in: req.body.deleteImages } } } });
  }
  req.flash("success", "Successfully Updated Campground");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.destroyCampground = async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash("success", "Campground DELETED");
  res.redirect("/campgrounds");
};
