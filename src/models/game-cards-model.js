import { DataTypes } from "sequelize";
import { sequelize } from "../config/database-config.js";

const GameCards = sequelize.define(
  "GameCards",
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
    cardId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Cards",
        key: "id",
      },
    },
    playerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Players",
        key: "id",
      },
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [["deck", "hand", "discard"]],
      },
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    playedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "GameCards",
    indexes: [
      {
        fields: ["gameId", "location"],
      },
      {
        fields: ["gameId", "playerId", "location"],
      },
    ],
  }
);

export default GameCards;
