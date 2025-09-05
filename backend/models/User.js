const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  role: { type: String, default: "user" }
});

userSchema.statics.hashPassword = password => bcrypt.hash(password, 10);
userSchema.statics.comparePassword = (password, hash) => bcrypt.compare(password, hash);

module.exports = mongoose.model("User", userSchema);
