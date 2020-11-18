const express = require('express');
const router = express.Router();
const fileUploader = require('../configs/cloudinary.config');
const Travelboard = require('../models/Travelboard.model');
const User = require('../models/User.model');
const City = require('../models/City.model');

router.get('/add-city/:boardid', (req, res, next) => {
  if (!req.session.currentUser) {
    res.redirect('/login');
    return;
  }

  const { boardid } = req.params;

  Travelboard.findById(boardid)
    .then((travelBoard) => {
      res.render('cities/add-city', {
        travelBoard,
      });
    })
    .catch((error) => next(error));
});

router.post(
  '/add-city/:boardid',
  fileUploader.single('cityPictureUrl'),
  (req, res, next) => {
    const { boardid } = req.params;
    const {
      city,
      experience,
      startDate,
      endDate,
      existingCityPictureUrl,
    } = req.body;

    let cityPictureUrl;
    if (req.file) {
      cityPictureUrl = req.file.path;
    } else {
      cityPictureUrl = existingCityPictureUrl;
    }

    City.create({
      city,
      country: boardid,
      experience,
      startDate,
      endDate,
      cityPictureUrl,
    })
      .then((newCity) => {
          Travelboard.findByIdAndUpdate(boardid, {
            $push: { cities: newCity._id },
          });
      })
      .then((newCity) => res.redirect(`/city-details/${newCity._id}`))
      .catch((error) => `Error while creating a new city: ${error}`);
  }
);

router.get('/city-details/:id', (req, res, next) => {
  const { id } = req.params;

  City.findById(id)
    .then((oneCity) => {
      res.render('cities/city-details', {
        oneCity,
      });
    })
    .catch((error) => next(error));
});

module.exports = router;
