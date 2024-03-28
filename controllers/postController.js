const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const mongoose = require("mongoose");

exports.post_getAll = asyncHandler(async (req, res, next) => {
  const posts = await Post.find(
    { isPublished: true },
    "title content postedTime postedBy comments"
  )
    .populate({ path: "postedBy", select: "username" })
    .populate({ path: "comments", select: "content" });
  res.json({
    posts: posts,
  });
});

exports.post_create = [
  body("title").trim().isLength({ min: 1 }).escape(),
  body("content").trim().isLength({ min: 1 }).escape(),
  body("isPublished").trim().escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // If there are validation errors, render the form again with errors
      res.json({ errors: errors });
    } else {
      const post = new Post({
        title: req.body.title,
        content: req.body.content,
        postedBy: new mongoose.Types.ObjectId(req.params.userID),
        postedTime: Date.now(),
        isPublished: req.body.isPublished,
      });
      post.save();
      res.json({ response: "successfully created post" });
    }
  }),
];

exports.post_edit = [
  body("title").trim().isLength({ min: 1 }).escape(),
  body("content").trim().isLength({ min: 1 }).escape(),
  body("isPublished").trim().escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // If there are validation errors, render the form again with errors
      res.json({ errors: errors });
    } else {
      const post = await Post.findById(req.params.postID);
      if (post === null) {
        const newPost = new Post({
          title: req.body.title,
          content: req.body.content,
          postedBy: new mongoose.Types.ObjectId(req.params.userID),
          postedTime: Date.now(),
          isPublished: req.body.isPublished,
        });
        newPost.save();
        res.json({ message: "created new cause not found" });
      } else {
        post.title = req.body.title;
        post.content = req.body.content;
        post.isPublished = req.body.isPublished;
        post.save();
        res.json({ message: "successfully updated" });
      }
    }
  }),
];

exports.post_delete = asyncHandler(async (req, res, next) => {
  await Promise.all([
    Post.findByIdAndDelete(req.params.postID),
    Comment.deleteMany({ postCommentedOn: req.params.postID }),
  ]);
  res.json({ message: "deleted successfully" });
});
