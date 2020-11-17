const express = require('express');
const router = express.Router();
const fileUploader = require('../configs/cloudinary.config');
const Travelboard = require('../models/Travelboard.model');
const User = require('../models/User.model');

router.get('/add-travel-board/:userid', (req, res, next) => {
  if (!req.session.currentUser) {
    res.redirect('/login');
    return;
  }

  res.render('add-travel-board', {
    userInSession: req.session.currentUser,
  });
});

router.post('/add-travel-board/:userid', fileUploader.single('profilePictureUrl'),
(req, res, next) => {
  const { userid } = req.params;
  const { country, experienceInput, existingPicUrl } = req.body;


   let travelBoardPictureUrl;
   if (req.file) {
     travelBoardPictureUrl = req.file.path;
   } else {
     travelBoardPictureUrl = existingPicUrl;
   }

  Travelboard.create({
    user: userid,
    country,
    experienceInput,
    travelBoardPictureUrl,
  })
    .then((newBoard) =>
      User.findByIdAndUpdate(userid, { $push: { travelBoards: newBoard._id } })
    )
    .then(() => res.redirect('/profile'))
    .catch((error) => `Error while creating a new Travel Board: ${error}`);
});

module.exports = router;