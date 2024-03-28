var express = require("express");
var router = express.Router();
const asyncHandler = require("express-async-handler");

const user_controller = require("../controllers/userController.js");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.json({ response: "home Page" });
});

router.get("/log-in", function (req, res, next) {
  res.json({ response: "sign-in Page" });
});

router.post("/sign-up", user_controller.sign_up_POST);

router.post("/log-in", user_controller.log_in_POST);

module.exports = router;

//all log in stuff there before home page!
