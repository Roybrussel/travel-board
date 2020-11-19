const express = require('express');
const router = express.Router();
const fileUploader = require('../configs/cloudinary.config');
const Travelboard = require('../models/travelboard.model');
const User = require('../models/User.model');

router.get('/discover', (req, res, next) => {
  Travelboard.find({})
    .populate('user')
    .then((allBoards) => {
      if (req.session.currentUser) {
        userInSession = req.session.currentUser;
        res.render('boards/discover-boards', { allBoards, userInSession });
        return;
      }

      res.render('boards/discover-boards', { allBoards });
    })
    .catch((error) => next(error));
});

router.get('/add-travel-board/:userid', (req, res, next) => {
  if (!req.session.currentUser) {
    res.redirect('/login');
    return;
  }

  res.render('boards/add-travel-board', {
    userInSession: req.session.currentUser,
  });
});

router.post(
  '/add-travel-board/:userid',
  fileUploader.single('travelBoardPictureUrl'),
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
        User.findByIdAndUpdate(userid, {
          $push: { travelBoards: newBoard._id },
        })
      )
      .then(() => res.redirect('/profile'))
      .catch((error) => `Error while creating a new Travel Board: ${error}`);
  }
);

router.get('/edit-travel-board/:id', (req, res, next) => {
  if (!req.session.currentUser) {
    res.redirect('/login');
    return;
  }

  const { id } = req.params;

  Travelboard.findById(id)
    .then((travelBoard) => {
      res.render('boards/edit-travel-board', {
        travelBoard,
        userInSession: req.session.currentUser,
      });
    })
    .catch((error) => next(error));
});

router.post(
  '/edit-travel-board/:id',
  fileUploader.single('travelBoardPictureUrl'),
  (req, res, next) => {
    const { id } = req.params;

    const { country, experienceInput, existingBoardPictureUrl } = req.body;

    let travelBoardPictureUrl;
    if (req.file) {
      travelBoardPictureUrl = req.file.path;
    } else {
      travelBoardPictureUrl = existingBoardPictureUrl;
    }

    Travelboard.findByIdAndUpdate(
      id,
      {
        country,
        experienceInput,
        travelBoardPictureUrl,
      },
      { new: true }
    )
      .then(() => {
        res.redirect(`/board-details/${id}`);
      })
      .catch((error) => next(error));
  }
);

router.get('/board-details/:id', (req, res, next) => {
  const { id } = req.params;

  if (!req.session.currentUser) {
    res.redirect('/login');
    return;
  }

  let userid = req.session.currentUser._id;
  let user = {};

  Travelboard.findById(id)
    .populate('user')
    .populate('cities')
    .then((travelBoard) => {
      if (userid == travelBoard.user._id) {
        res.render('boards/travelboard-details', {
          travelBoard,
          user,
          userInSession: req.session.currentUser,
        });
      } else {
        res.render('boards/travelboard-details', {
          travelBoard,
          userInSession: req.session.currentUser,
          user: false,
        });
      }
    })
    .catch((error) => next(error));
});

router.post('/board-delete/:id', (req, res, next) => {
  const { id } = req.params;
  Travelboard.findByIdAndDelete(id)
    .then(() => res.redirect('/profile'))
    .catch((error) =>
      console.log(
        `There was an error, while trying to delete the board: ${error}`
      )
    );
});

module.exports = router;
