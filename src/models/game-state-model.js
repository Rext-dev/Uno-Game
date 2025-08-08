import { DataTypes } from "sequelize";
import { sequelize } from "../config/database-config.js";
import { TURN_DIRECTION } from "../config/game-constants.js";

const GameState = sequelize.define(
  "GameState",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    gameId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: "Games",
        key: "id",
      },
    },
    currentPlayerPosition: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    direction: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: TURN_DIRECTION.CLOCKWISE,
      validate: {
        isIn: [Object.values(TURN_DIRECTION)],
      },
    },
    topDiscardCard: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    currentColor: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    drawStack: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    lastAction: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    tableName: "GameState",
  }
);

export default GameState;
