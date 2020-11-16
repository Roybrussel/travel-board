const express = require("express");
const router = express.Router();

module.exports = router;

router.get("/add-travel-board", (req, res, next) => {
  res.render("add-travel-board");
});
