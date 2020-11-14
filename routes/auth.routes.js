const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const passport = require('passport');
const { Router } = require('express');
const User = require('../models/User.model');

const router = new Router();
const saltRounds = 10;

module.exports = router;
