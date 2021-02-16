const mongoose = require('mongoose');
const { Schema } = mongoose;

const ItemSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  grade: {
    type: Number,
    default: 5,
  }, 
  lvl: {
    type: Number,
    required: true,
    default: 1,
  },
  cost: {
    type: Number,
    required: true
  }
});

const ItemModel = mongoose.model('items', ItemSchema);


module.exports = ItemModel;