var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
const { token } = require("morgan");
require("dotenv");

const postController = require("../controllers/postController");
const commentController = require("../controllers/commentController");

function extractToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.redirect("/");
  }
}
function verifyToken(req, res, next) {
  jwt.verify(req.token, process.env.secret_Key, (err, authData) => {
    if (err) {
      res.redirect("/");
    } else {
      req.user = authData;
      next();
    }
  });
}

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.json({
    message: "Blog Page",
  });
});

router.get("/posts", postController.post_getAll);

router.post("/posts/:postID/comment/create", commentController.comment_create);



//Owner endpoints! Authenticated
router.use("/:userID", extractToken, verifyToken);

router.post("/:userID/posts/create", postController.post_create);

router.put("/:userID/posts/:postID/edit", postController.post_edit);

router.delete("/:userID/posts/:postID/delete", postController.post_delete);

module.exports = router;
