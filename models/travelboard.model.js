const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const travelSchema = new Schema({
  country: { type: String, required: true },
  experienceInput: { type: String, required: true },
  travelBoardPictureUrl: {
    type: String,
    default: "/images/default-travelboard-img.png",
  },
});

module.exports = model("Travelboard", travelSchema);
