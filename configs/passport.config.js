const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/User.model.js');
const LocalStrategy = require('passport-local').Strategy;

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
              errorMessage: 'This email address was not recognized',
            });
          }

          if (!bcrypt.compareSync(passWord, user.passwordHash)) {
            return done(null, false, {
              errorMessage: 'Incorrect password',
            });
          }

          done(null, user);
        })
        .catch((err) => done(err));
    }
  )
);

module.export = passport;
