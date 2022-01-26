const mongoose = require("mongoose");
const { Schema } = mongoose;
const Review = require("./review");

const CampgroundSchema = new Schema({
  title: String,
  image: [
    {
      url: String,
      filename: String,
    },
  ],
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  price: Number,
  description: String,
  location: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

CampgroundSchema.post("findOneAndDelete", async (data) => {
  if (data) {
    await Review.deleteMany({
      _id: {
        // We are deleting all reviews
        $in: data.reviews, // where their ID fields is in our data/document
      },
    });
  }
});

module.exports = mongoose.model("Campground", CampgroundSchema);
