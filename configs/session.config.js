const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const app = express();
const MongoStore = require('connect-mongo')(session);
const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/User.model.js');
const LocalStrategy = require('passport-local').Strategy;

app.use(
  session({
    secret: process.env.SESS_SECRET,
    name: 'appCookie',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }, //Even uitzoeken wat een normale cookie-tijd is
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 60 * 60 * 24 * 14,
    }),
  })
);

passport.serializeUser((user, callback) => {
  callback(null, user._id);
});

passport.deserializeUser((id, callback) => {
  User.findById(id)
    .then((user) => callback(null, user))
    .catch((err) => callback(err));
});

// Passport LocalStrategy
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'passWord',
    },
    (email, passWord, done) => {
      User.findOne({
        email,
      })
        .then((user) => {
          if (!user) {
            return done(null, false, {
              message: 'Incorrect email address',
            });
          }

          if (!bcrypt.compareSync(passWord, user.passwordHash)) {
            return done(null, false, {
              message: 'Incorrect password',
            });
          }

          done(null, user);
        })
        .catch((err) => done(err));
    }
  )
);

app.use(passport.initialize());
app.use(passport.session());
