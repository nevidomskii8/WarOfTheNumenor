const mongoose = require('mongoose');
const { Schema } = mongoose;

const LocationSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: false,
  },
  creeps: {
    type: Array,
    default: ['Волк'],
  },
  lvl: {
    type: String,
    default: "Слабый"
  },
  img: {
    type: String,
    default: "Волк",
  }
});

const LocationModel = mongoose.model('location', LocationSchema);

module.exports = LocationModel;