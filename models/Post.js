// Require Mongoose
const mongoose = require("mongoose");

// Define a schema
const Schema = mongoose.Schema;

const Post = new Schema({
  title: {
    type: String,
    min: [1, "Too short"],
    max: [20, "Too long"],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  postedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  postedTime: {
    type: Date,
    required: true,
    default: Date.now,
  },
  comments: {
    type: Schema.Types.ObjectId,
    ref: "Comment",
  },
  isPublished : {
    type: Boolean,
    required: true,
    default: true,
  }
});

module.exports = mongoose.model("Post", Post);
