const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    firstName: String,
    lastName: String,
    travelBoards: [{ type: Schema.Types.ObjectId, ref: 'Travelboard' }],
    profilePictureUrl: {
      type: String,
    },
    favoriteDestination: String,
    about: String,
  },
  {
    timestamps: true,
  }
);

module.exports = model('User', userSchema);
