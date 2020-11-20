const express = require("express");
const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {
  if (!req.session.currentUser) {
    res.render("index");
    return;
  }

  res.render("index", {
    userInSession: req.session.currentUser,
  });
});

router.get("/test", (req, res, next) => res.render("test"));

function countChars(obj) {
  var strLength = obj.value.length;
  document.getElementById("currentEditProfile").innerHTML = strLength;
}

module.exports = router;
