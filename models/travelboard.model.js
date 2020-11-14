const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const travelSchema = new Schema();

module.exports = model('Travelboard', travelSchema);
