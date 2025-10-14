const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    publishedAt: { type: Date, default: Date.now },
    source: { type: String },
    image: { type: String },
    url: { type: String },
    category: { type: String },
  },
  { timestamps: true }
);

newsSchema.index({ title: "text", content: "text", author: "text" });

module.exports = mongoose.model("News", newsSchema);
