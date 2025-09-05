const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  images: [String],
  category: String,
  subcategory: String,
  meta: [String],
  links: [String],
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
  views: { type: Number, default: 0 },
  translations: Object
});

module.exports = mongoose.model("Post", postSchema);
