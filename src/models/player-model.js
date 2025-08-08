import { DataTypes } from "sequelize";
import { sequelize } from "../config/database-config.js";
import bcrypt from "bcrypt";

const Player = sequelize.define("Player", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 100],
    },
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
      notEmpty: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [6, 100],
    },
  },
}, {
  hooks: {
    beforeCreate: async (player) => {
      try {
        if (player.password) {
          const saltRounds = 10;
          player.password = await bcrypt.hash(player.password, saltRounds);
        }
      } catch (error) {
        throw new Error("Error hashing password: " + error.message);
      }
    }
  }
});

/**
 * Compare plain password with hashed password
 * @param {string} plainPassword
 * @returns {Promise<boolean>}
 */
Player.prototype.comparePassword = async function(plainPassword) {
  return await bcrypt.compare(plainPassword, this.password);
};

export default Player;
