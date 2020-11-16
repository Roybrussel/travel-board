const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const travelSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  country: { type: String, required: true },
  experienceInput: { type: String, required: true },
  travelBoardPictureUrl: {
    type: String,
    default: '/images/default-travelboard-img.png',
  },
});

module.exports = model('Travelboard', travelSchema);
