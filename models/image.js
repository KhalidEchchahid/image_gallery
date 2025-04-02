const mongoose = require("mongoose")

const ImageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  originalUrl: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "No description",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("Image", ImageSchema)

