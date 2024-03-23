// Require Mongoose
const mongoose = require("mongoose");

// Define a schema
const Schema = mongoose.Schema;

const Comment = new Schema({
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
});

module.exports = mongoose.model("Comment", Comment);
