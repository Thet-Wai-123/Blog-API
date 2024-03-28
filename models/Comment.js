// Require Mongoose
const mongoose = require("mongoose");

// Define a schema
const Schema = mongoose.Schema;

const Comment = new Schema({
  content: {
    type: String,
    required: true,
  },
  postCommentedOn: {
    type: Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  postedTime: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

module.exports = mongoose.model("Comment", Comment);
