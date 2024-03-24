const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.sign_up_POST = [
  body("username")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .custom(async (value) => {
      const user = await User.findOne({ username: value });
      if (user !== null) {
        return Promise.reject();
      }
    })
    .withMessage("Username already exists"),

  body("password").trim().isLength({ min: 1 }).escape(),

  body("password_confirmation")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage("Passwords don't match"),

  //handle errors and handle route
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // If there are validation errors, render the form again with errors
      res.json({ errors: errors });
    } else {
      // If there are no error s, save the user and redirect to log-in
      const user = new User({
        username: req.body.username,
        password: req.body.password,
      });

      await user.save();
      res.redirect("/log-in");
    }
  }),
];

exports.log_in_POST = [
  asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      res.json({ respones: "User Not Found" });
    } else if (user.password !== req.body.password) {
      res.json({ respones: "Wrong Password" });
    }
    jwt.sign(
      { user: user },
      process.env.secret_Key,
      //{ expiresIn: "1d" },
      (err, token) => {
        if (err) {
          return res.status(500);
        } else {
          //localStorage.setItem(token); test out if this stores in a web browser
          res.json({
            token: token,
            redirect_path: "/blog"
          });
        }
      }
    );
  }),
];
