const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const citySchema = new Schema(
  {
    city: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    country: { type: Schema.Types.ObjectId, ref: 'Travelboard' },
    experience: { type: String },
    cityPictureUrl: {
      type: String,
      default: './images/default-profile-img.png',
    },
    startDate: { type: String },
    endDate: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = model('City', citySchema);
