const express = require('express');
const router = express.Router();

const travelBoard = require('../models/Travelboard.model');
const User = require('../models/User.model');

router.get('/profile', (req, res, next) =>
  res.render('user/user-profile', {
    userInSession: req.session.currentUser || null,
  })
);

router.get('/edit-profile/:id', (req, res, next) => {
  if (!req.session.currentUser) {
    res.redirect('/login');
    return;
  }

  res.render('user/edit-user-profile', {
    userInSession: req.session.currentUser,
  });
});

router.post('/edit-profile/:id', (req, res, next) => {
  const { id } = req.params;

  const {
    email,
    firstName,
    lastName,
    about,
    favoriteDestination,
    profilePictureUrl,
  } = req.body;

  User.findByIdAndUpdate(
    id,
    {
      email,
      firstName,
      lastName,
      about,
      favoriteDestination,
      profilePictureUrl
    },
    { new: true }
  )
    .then((updatedUser) => {
      console.log(updatedUser);
      res.redirect('/profile');
    })
    .catch((error) => next(error));
});

router.get('/add-travel-board', (req, res, next) => {
  res.render('add-travel-board');
});

router.post('/add-travel-board', (req, res, next) => {
  const { country, experienceInput, travelBoardPictureUrl } = req.body;

  travelBoard
    .create({
      country,
      experienceInput,
      travelBoardPictureUrl,
    })
    .then(() => res.redirect('/profile'))
    .catch((error) => `Error while creating a new Travel Board: ${error}`);
});

module.exports = router;
