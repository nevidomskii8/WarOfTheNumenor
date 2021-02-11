const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const secret = 'secret';
const SALT_FACTOR = 10;

const { Schema } = mongoose;

const HeroSchema = new Schema({
  login: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    unique: false,
    set: rawPassword => bcrypt.hashSync(rawPassword, SALT_FACTOR)
  },
  level: {
    type: Number,
    default: 1,
  },
  power: {
    type: Number,
    default: 1,
  },
  attack: {
    minDmg: {
      type:Number,
      default:1,
    },
    maxDmg: {
      type:Number,
      default: 15,
    }
  },
  def: {
    type: Number,
    default: 60,
  },
  army: {
    minDmg: {
      type: Number,
    },
    maxDmg: {
      type: Number,
    },
    horsemen: {
      minionHp: {
        type: Number,
        default:1
      },
      minDmg: {
        type: Number,
        default: 1
      },
      maxDmg: {
        type: Number,
        default: 3
      },
      count: {
        type: Number,
        default: 5,
      }
    },
    archers: {
      minionHp: {
        type: Number,
        default:1
      },
      minDmg: {
        type: Number,
        default: 1
      },
      maxDmg: {
        type: Number,
        default: 3
      },
      count: {
        type: Number,
        default: 5,
      }
    },
    infantry: {
      minionHp: {
        type: Number,
        default:1
      },
      minDmg: {
        type: Number,
        default: 1
      },
      maxDmg: {
        type: Number,
        default: 3
      },
      count: {
        type: Number,
        default: 5,
      }
    }
  },
  heroMagic: {
    mage: {
      chanсe: {
        type: Number,
        default: 30
      },
      dmg: {
        type: Number,
        default: 2
      }
    },
    human: {
      chanсe: {
        type: Number,
        default: 20
      },
      dmg: {
        type: Number,
        default: 2
      },
    },
    elf: {
      chanсe: {
        type: Number,
        default: 20
      },
      dmg: {
        type: Number,
        default: 2
      }
    },
    gnome: {
      chanсe: {
        type: Number,
        default: 20
      },
      dmg: {
        type: Number,
        default: 2
      }
    },
    valar: {
      chanсe: {
        type: Number,
        default: 5
      },
      dmg: {
        type: Number,
        default: 800
      }
    },
    morgote: {
      chanсe: {
        type: Number,
        default: 2
      },
      dmg: {
        type: Number,
        default: 2000
      }
    },
  },
  buffAttack: {
    crit: {
      chance: {
        type: Number,
        default: 10,
      },
      dmg: {
        type: Number,
        default: 100,
      }
    },
    surprise: {
      chance: {
        type:Number,
        default: 10,
      },
      dmg: {
        type: Number,
        default: 50,
      }
    }
  },
  buffHp: {
    def: {
      type: Number,
      default: 100,
    },
    armour: {
      type: Number,
      default: 100,
    },
    evasion: {
      type: Number,
      default: 15,
    }
  }
});

HeroSchema.methods.auth = function (password) {
  return bcrypt.compare(password, this.password).then(result => {
    if(result) {
      return jwt.sign({ _id: this._id }, secret);
    }
  })
}

HeroSchema.statics.verifyToken = function (token) {
  return new Promise((res, rej) => {
    jwt.verify(token, secret, function(err, decoded) {
      if (err) return rej(err);
      return res(decoded);
    });
  })
};
const HeroModel = mongoose.model('heroes', HeroSchema);

module.exports = HeroModel;