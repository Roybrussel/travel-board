const express = require('express');
const router = express.Router();
const fileUploader = require('../configs/cloudinary.config');
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

router.get('/:id/profile', (req, res, next) => {
  const { id } = req.params;

  if (!req.session.currentUser) {
    res.redirect('/login');
    return;
  }

  if (req.session.currentUser) {
    User.findById(id)
      .populate('travelBoards')
      .then((foundUser) => {
        res.render('user/other-user-profile', {
          foundUser,
          userInSession: req.session.currentUser,
        });
      })
      .catch((err) => {
        `Error while getting user from the DB: ${err}`;
      });
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
      .then((user) => {
        req.session.currentUser = user;
        res.redirect('/profile');
      })
      .catch((error) => next(error));
  }
);

module.exports = router;
