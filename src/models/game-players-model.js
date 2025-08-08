import { DataTypes } from "sequelize";
import { sequelize } from "../config/database-config.js";
import { PLAYER_STATUS } from "../config/game-constants.js";
import Player from "./player-model.js";

const GamePlayers = sequelize.define(
  "GamePlayers",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    gameId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Games",
        key: "id",
      },
    },
    playerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Players",
        key: "id",
      },
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: PLAYER_STATUS.WAITING,
      validate: {
        isIn: [Object.values(PLAYER_STATUS)],
      },
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    score: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    joinedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    leftAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "GamePlayers",
    indexes: [
      {
        unique: true,
        fields: ["gameId", "playerId"],
      },
      {
        unique: true,
        fields: ["gameId", "position"],
      },
    ],
  }
);

GamePlayers.belongsTo(Player, { 
  foreignKey: 'playerId', 
  as: 'Player' 
});

export default GamePlayers;
