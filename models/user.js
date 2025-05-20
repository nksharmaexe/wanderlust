const { required } = require("joi");
const mongoose = require("mongoose");
const { use } = require("passport");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  resetToken: String,
  resetTokenExpiry: Date,
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
