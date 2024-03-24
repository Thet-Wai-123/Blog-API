const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Comment = require("../models/Comment");
const mongoose = require("mongoose");

exports.comment_create = [
  body("content").trim().isLength({ min: 1 }).escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // If there are validation errors, render the form again with errors
      res.json({ errors: errors });
    } else {
      const comment = new Comment({
        content: req.body.content,
        postCommentedOn: new mongoose.Types.ObjectId(req.params.postID),
        postedTime: Date.now(),
      });
      comment.save();
      res.json("Commented successfully")
    }
  }),
];
