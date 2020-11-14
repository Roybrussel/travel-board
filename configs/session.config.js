const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const app = express();
const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('./models/User.model');
const LocalStrategy = require('passport-local').Strategy;

app.use(passport.initialize());
app.use(passport.session());

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
      usernameField: 'username', // by default
      passwordField: 'password', // by default
    },
    (username, password, done) => {
      User.findOne({ username })
        .then((user) => {
          if (!user) {
            return done(null, false, { message: 'Incorrect username' });
          }

          if (!bcrypt.compareSync(password, user.password)) {
            return done(null, false, { message: 'Incorrect password' });
          }

          done(null, user);
        })
        .catch((err) => done(err));
    }
  )
);
