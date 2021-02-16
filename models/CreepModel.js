const mongoose = require('mongoose');
const { Schema } = mongoose;

const CreepSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  img: {
    type: String,
  },
  hp: {
    type: Number,
    default: 20,
  },
  dmg: {
    min: {
      type:Number,
      default: 10,
    },
    max: {
      type: Number,
      default: 20,
    }
  },
  buff: {
    type: Number,
    default: 0,
  },
  evasion: {
    type: Number,
    default: 20,
  },
  crit: {
    chance: {
      type: Number,
      default: 20,
    },
    dmg: {
      type: Number,
      default: 120,
    }
  },
  buffLoot: {
    type: Number,
    default: 0,
  },
  loot: {
    type: Array,
    default: [
      {
        itemName: 'Эссенция мага',
        chance: 100,
        grade: 'common'
      }
    ]
  }
});

const CreepModel = mongoose.model('creeps', CreepSchema);

module.exports = CreepModel;