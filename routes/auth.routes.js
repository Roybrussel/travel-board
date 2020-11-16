const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const passport = require('passport');
const { Router } = require('express');
const User = require('../models/User.model');
require('../configs/session.config');
const router = new Router();
const saltRounds = 10;

router.get('/signup', (req, res) => {
  res.render('auth/signup');
});

router.post('/signup', (req, res, next) => {
  const { email, passWord, passWordRepeat } = req.body;

  if (!email || !passWord || !passWordRepeat) {
    res.render('auth/signup', {
      email,
      errorMessage: 'All fields are mandatory. Please fill in all fields',
    });
    return;
  }

  const emailRegex = /^\S+@\S+\.\S+$/;

  if (!emailRegex.test(email)) {
    res.render('auth/signup', {
      errorMessage: 'Please fill in a valid email ',
    });
    return;
  }

  User.findOne({ email }).then((results) => {
    if (!results) {
      const strongPassRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;

      if (!strongPassRegex.test(passWord)) {
        res.render('auth/signup', {
          email,
          errorMessage:
            'Password should be a least 8 characters long and contain a number, a small letter and a capital letter.',
        });
        return;
      }

      if (passWord !== passWordRepeat) {
        res.render('auth/signup', {
          email,
          errorMessage: 'Passwords are not identical',
        });
        return;
      }

      bcrypt
        .genSalt(saltRounds)
        .then((salt) => bcrypt.hash(passWord, salt))
        .then((hashedPassword) => {
          return User.create({
            email,
            passwordHash: hashedPassword,
          })
            .then((newUser) => {
              req.user = newUser;
              res.redirect('/profile', { user: req.user });
            })
            .catch((error) => next(error));
        });
    } else {
      res.render('auth/signup', {
        errorMessage: `This email is already registered. Use a different email  or login`,
      });
    }
  });
});

router.get('/login', (req, res) => res.render('auth/login'));

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/login',
  })
);

module.exports = router;
