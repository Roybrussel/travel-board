const express = require('express');
const router = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index', {
    userInSession: req.session.currentUser,
  });
});

router.get('/profile-design', (req, res, next) => {
  res.render('profile-design');
});

module.exports = router;
