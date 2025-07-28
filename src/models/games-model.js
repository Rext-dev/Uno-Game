import { DataTypes } from "sequelize";
import { sequelize } from "../config/database-config.js";

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
        isIn: ["inactive", "active"],
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
  },
  {
    tableName: "Games",
  }
);

export default Games;
