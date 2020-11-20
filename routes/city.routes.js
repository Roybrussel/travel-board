const express = require('express');
const router = express.Router();
const fileUploader = require('../configs/cloudinary.config');
const Travelboard = require('../models/travelboard.model');
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
        userInSession: req.session.currentUser,
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
      fullStartDate,
      fullEndDate,
      existingCityPictureUrl,
    } = req.body;

    let startDate = new Date(fullStartDate);
    let endDate = new Date(fullEndDate);

    startDate = startDate.toDateString();
    endDate = endDate.toDateString();

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
        }).then((foundBoard) => {
          City.findByIdAndUpdate(newCity._id, {
            user: foundBoard.user,
          }).then((updatedCity) =>
            res.redirect(`/city-details/${updatedCity._id}`)
          );
        });
      })
      .catch((error) => `Error while creating a new city: ${error}`);
  }
);

router.get('/city-details/:id', (req, res, next) => {
  const { id } = req.params;

  let userid = req.session.currentUser._id;
  let user = {};

  City.findById(id)
    .populate('user')
    .populate('country')
    .then((oneCity) => {
      if (userid == oneCity.user._id) {
        res.render('cities/city-details', {
          oneCity,
          userInSession: req.session.currentUser,
          user,
        });
      } else {
        res.render('cities/city-details', {
          oneCity,
          userInSession: req.session.currentUser,
        });
      }
    })
    .catch((error) => next(error));
});

router.post('/city-delete/:id', (req, res, next) => {
  const { id } = req.params;
  City.findById(id)
    .then((foundCity) => {
      const boardID = foundCity.country;
      const id = foundCity._id;
      City.findByIdAndDelete(id).then(() =>
        res.redirect(`/board-details/${boardID}`)
      );
    })
    .catch((error) =>
      console.log(
        `There was an error, while trying to delete the board: ${error}`
      )
    );
});

router.get('/edit-city/:id', (req, res, next) => {
  if (!req.session.currentUser) {
    res.redirect('/login');
    return;
  }

  const { id } = req.params;

  City.findById(id)
    .then((oneCity) => {
      res.render('cities/edit-city', {
        oneCity,
        userInSession: req.session.currentUser,
      });
    })
    .catch((error) => next(error));
});

router.post(
  '/edit-city/:id',
  fileUploader.single('cityPictureUrl'),
  (req, res, next) => {
    const { id } = req.params;

    const { city, experience, existingCityPictureUrl } = req.body;

    let cityPictureUrl;
    if (req.file) {
      cityPictureUrl = req.file.path;
    } else {
      cityPictureUrl = existingCityPictureUrl;
    }

    City.findByIdAndUpdate(
      id,
      {
        city,
        experience,
        cityPictureUrl,
      },
      { new: true }
    )
      .then((updatedCity) => {
        oneCity = updatedCity;
        res.redirect(`/city-details/${id}`);
      })
      .catch((error) => next(error));
  }
);

module.exports = router;
