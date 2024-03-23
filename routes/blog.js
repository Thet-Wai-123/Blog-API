var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
const { token } = require("morgan");
require("dotenv");

router.use(extractToken, verifyToken);

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
    user: req.user,
  });
});

module.exports = router;
