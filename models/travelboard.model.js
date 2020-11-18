const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const travelSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    cities: [{ type: Schema.Types.ObjectId, ref: 'City' }],
    country: { type: String, required: true },
    experienceInput: { type: String, required: true },
    travelBoardPictureUrl: {
      type: String,
      default: './images/default-profile-img.png',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model('Travelboard', travelSchema);
