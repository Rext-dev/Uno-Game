import { DataTypes } from "sequelize";
import { sequelize } from "../config/database-config.js";

/**
 * Card model for UNO game.
 * Represents individual cards in the game deck.
 * Each card has a color, value, and belongs to a game.
 */
const Card = sequelize.define("Card", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  color: {
    type: DataTypes.STRING(10),
    allowNull: false,
    validate: {
      isIn: [['red', 'blue', 'green', 'yellow', 'black']],
    },
  },
  value: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: {
      isIn: [[
        // Numbers
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
        // Colored special cards
        'Skip', 'Reverse', 'Draw Two',
        // Wild cards
        'Wild', 'Wild Draw Four'
      ]],
    },
  },
  gameId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Games',
      key: 'id',
    },
  },
  ownerId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Players',
      key: 'id',
    },
  },
  status: {
    type: DataTypes.STRING(10),
    allowNull: false,
    defaultValue: 'deck',
    validate: {
      isIn: [['deck', 'hand', 'discard']],
    },
  },
  
}, {
  tableName: "Cards",
  timestamps: true,
});

export default Card;
