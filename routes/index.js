const express = require("express");
const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

/* GET profile page */
router.get("/profile", (req, res, next) => {
  res.render("profile");
});

/* GET profile design page */
router.get("/profile-design", (req, res, next) => {
  res.render("profile-design");
});

module.exports = router;
