const express = require("express");
const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/profile-design", (req, res, next) => {
  res.render("profile-design");
});

/* GET profile page */
router.get("/profile", (req, res, next) => {
  res.render("profile");
});

module.exports = router;
