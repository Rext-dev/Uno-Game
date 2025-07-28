// src/models/score-model.js
// Importa Sequelize y la conexión a la base de datos.
// Define el modelo 'Score' para el historial.
// Atributos: score, date.
// Define las relaciones (e.g., un score pertenece a un Player y a un UnoGame).
// Exporta el modelo.

import { DataTypes } from "sequelize";
import { sequelize } from "../config/database-config.js";

/**
 * Score model for UNO game results.
 * Stores the final score for each player in each game.
 */
const Score = sequelize.define(
  "Score",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    playerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Players",
        key: "id",
      },
    },
    gameId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Games",
        key: "id",
      },
    },
  },
  {
    tableName: "Scores",
    timestamps: false,
  }
);

export default Score;
