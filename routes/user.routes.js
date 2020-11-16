const express = require('express');
const router = express.Router();

router.get('/profile', (req, res, next) =>
  res.render('user/user-profile', {
    userInSession: req.session.currentUser || null,
  })
);

router.get('/add-travel-board', (req, res, next) => {
  res.render('add-travel-board');
});

module.exports = router;
