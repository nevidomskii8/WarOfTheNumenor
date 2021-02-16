const mongoose = require('mongoose');
const { Schema } = mongoose;

const LocationSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  creeps: {
    type: Array,
    default: ['Волк'],
  },
  lvl: {
    type: String,
    default: "Слабый"
  }
});

const LocationModel = mongoose.model('location', LocationSchema);

module.exports = LocationModel;