const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const passport = require("passport");
const { Router } = require("express");
const User = require("../models/User.model");
const router = new Router();
const saltRounds = 10;

router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const {
    email,
    firstName,
    lastName,
    about,
    favoriteDestination,
    passWord,
    passWordRepeat,
  } = req.body;

  if (!email || !passWord || !passWordRepeat) {
    res.render("auth/signup", {
      email,
      errorMessage:
        "Email and password are mandatory. Please fill in these fields",
    });
    return;
  }

  const emailRegex = /^\S+@\S+\.\S+$/;

  if (!emailRegex.test(email)) {
    res.render("auth/signup", {
      errorMessage: "Please fill in a valid email address",
    });
    return;
  }

  User.findOne({ email }).then((results) => {
    if (!results) {
      const strongPassRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;

      if (!strongPassRegex.test(passWord)) {
        res.render("auth/signup", {
          email,
          errorMessage:
            "Password should be a least 8 characters long and contain a number, a small letter and a capital letter.",
        });
        return;
      }

      if (passWord !== passWordRepeat) {
        res.render("auth/signup", {
          email,
          errorMessage: "Passwords are not identical",
        });
        return;
      }

      bcrypt.hash(passWord, saltRounds).then((hashedPassword) => {
        const newUser = new User({
          email,
          passwordHash: hashedPassword,
          firstName,
          lastName,
          about,
          favoriteDestination,
        });

        newUser
          .save()
          .then((newUser) => {
            req.session.currentUser = newUser;
            res.redirect("/profile");
          })
          .catch((error) => next(error));
      });
    } else {
      res.render("auth/signup", {
        errorMessage: `This email has already been registered. Use a different email  or login`,
      });
    }
  });
});

router.get("/login", (req, res) => res.render("auth/login"));

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, theUser, failureDetails) => {
    if (err) {
      return next(err);
    }

    if (!theUser) {
      res.render("auth/login", { errorMessage: "Wrong password or username" });
      return;
    }

    req.login(theUser, (err) => {
      if (err) {
        return next(err);
      }
      req.session.currentUser = theUser;
      res.redirect("/profile");
    });
  })(req, res, next);
});

router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }
    res.redirect("/");
  });
});

module.exports = router;
