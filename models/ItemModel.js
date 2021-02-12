const mongoose = require('mongoose');
const { Schema } = mongoose;

const ItemSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  chance: {
    type: Number,
    default: 5,
  }
});

const ItemModel = mongoose.model('items', ItemSchema);

module.exports = ItemModel;