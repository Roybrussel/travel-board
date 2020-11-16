const express = require("express");
const router = express.Router();

const travelBoard = require("../models/Travelboard.model");
router.get("/profile", (req, res, next) =>
  res.render("user/user-profile", {
    userInSession: req.session.currentUser || null,
  })
);

router.get("/add-travel-board", (req, res, next) => {
  res.render("add-travel-board");
});

router.post("/add-travel-board", (req, res, next) => {
  const { country, experienceInput, travelBoardPictureUrl } = req.body;

  travelBoard
    .create({
      country,
      experienceInput,
      travelBoardPictureUrl,
    })
    .then(() => res.redirect("/profile"))
    .catch((error) => `Error while creating a new Travel Board: ${error}`);
});

module.exports = router;
