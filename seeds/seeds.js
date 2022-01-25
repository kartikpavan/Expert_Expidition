const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelper");

mongoose
  .connect("mongodb://localhost:27017/hillsideCreek")
  .then(() => {
    console.log("MongoDb Connection Established");
  })
  .catch((err) => {
    console.log("oh uh !! something went wrong");
    console.log(err);
  });

const sample = (array) => array[Math.floor(Math.random() * array.length)];

async function seedDb() {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    // we have 406 cities in cities.js dataset
    const random406 = Math.floor(Math.random() * 406);
    var max = 4999;
    var min = 1999;
    const price = Math.floor(Math.random() * (max - min + 1) + min);
    const camp = new Campground({
      author: "61ee6795b6fc84d9034ff45a",
      location: `${cities[random406].city}, ${cities[random406].admin_name} `,
      title: `${sample(descriptors)} ${sample(places)}`,
      description: "Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Mauris at auctor odio. Etiam porta leo nec lacus volutpat, id elementum orci consequat. Pellentesque vel mauris non dui dignissim laoreet. Fusce sit amet ligula in velit elementum ornare eu non lacus. Sed sed nulla id augue accumsan commodo. Praesent euismod luctus massa ac volutpat. Pellentesque ex nisi, mollis id mi quis, dictum consequat dolor. ",
      price,
      image: [
        {
          url: "https://res.cloudinary.com/dzanfytxa/image/upload/v1643120389/hillside-creek/xx8az5jystqzfqzvph40.jpg",
          filename: "hillside-creek/xx8az5jystqzfqzvph40",
        },
        {
          url: "https://res.cloudinary.com/dzanfytxa/image/upload/v1643120393/hillside-creek/tjmnzgypxrqy9rhih4sd.jpg",
          filename: "hillside-creek/tjmnzgypxrqy9rhih4sd",
        },
      ],
    });
    await camp.save();
  }
}

seedDb();
