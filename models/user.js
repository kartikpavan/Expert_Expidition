const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

userSchema.plugin(passportLocalMongoose); // automatically creates username , password fields along with some inbuilt methods like authenticate() , serialize() ,deserialize()

module.exports = mongoose.model("User", userSchema);
