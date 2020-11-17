const express = require('express');
const router = express.Router();
const fileUploader = require('../configs/cloudinary.config');
const Travelboard = require('../models/Travelboard.model');
const User = require('../models/User.model');

router.get('/profile', (req, res, next) => {
  if (req.session.currentUser) {
    User.findById(req.session.currentUser._id)
      .populate('travelBoards')
      .then((foundUser) => {
        res.render('user/user-profile', {
          userInSession: foundUser || null,
        });
      })
      .catch((err) => {
        `Error while getting user from the DB: ${err}`;
      });
  } else {
    res.redirect('login');
  }
});

router.get('/edit-profile/:id', (req, res, next) => {
  if (!req.session.currentUser) {
    res.redirect('/login');
    return;
  }

  res.render('user/edit-user-profile', {
    userInSession: req.session.currentUser,
  });
});

router.post(
  '/edit-profile/:id',
  fileUploader.single('profilePictureUrl'),
  (req, res, next) => {
    const { id } = req.params;

    const {
      firstName,
      lastName,
      about,
      favoriteDestination,
      existingProfilePic,
    } = req.body;

    console.log(req.body, req.file);

    let profilePictureUrl;
    if (req.file) {
      profilePictureUrl = req.file.path;
    } else {
      profilePictureUrl = existingProfilePic;
    }

    User.findByIdAndUpdate(
      id,
      {
        firstName,
        lastName,
        about,
        favoriteDestination,
        profilePictureUrl,
      },
      { new: true }
    )
      .then(() => {
        res.redirect('/profile');
      })
      .catch((error) => next(error));
  }
);

router.get('/add-travel-board/:userid', (req, res, next) => {
  if (!req.session.currentUser) {
    res.redirect('/login');
    return;
  }

  res.render('add-travel-board', {
    userInSession: req.session.currentUser,
  });
});

router.post('/add-travel-board/:userid', (req, res, next) => {
  const { userid } = req.params;
  const { country, experienceInput, travelBoardPictureUrl } = req.body;

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
