const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  //userName: { Type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  firstName: String,
  lastName: String,
  travelBoards: [{ type: Schema.Types.ObjectId, ref: 'Travelboard' }],
  profilePictureUrl: {
    type: String,
    default: '/images/default-profile-img.png',
  },
  favoriteDestination: String,
  about: String,
});

module.exports = model('User', userSchema);
