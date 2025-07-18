const mongoose = require("mongoose");
const slugify = require("./slugUtility");

const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
  },
});

categorySchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title);
  }
  next();
});

const categories = mongoose.model("Category", categorySchema);

module.exports = categories;
