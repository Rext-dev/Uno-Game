import { DataTypes } from "sequelize";
import { sequelize } from "../config/database-config.js";
import { GAME_STATUS } from "../config/game-constants.js";
const Games = sequelize.define(
  "Games",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 100],
      },
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        isIn: [Object.values(GAME_STATUS)],
      },
    },
    maxPlayers: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
        min: 1,
      },
    },
    rules: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    }
  },
  {
    tableName: "Games",
  }
);

export default Games;
