import { Sequelize, DataTypes } from "sequelize";

export const createTestDB = () => {
  return new Sequelize("sqlite::memory:", { logging: false });
};

const initModels = (testDB) => {
  const TestPlayer = testDB.define("Player", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING },
    age: { type: DataTypes.INTEGER },
    email: { type: DataTypes.STRING },
    password: { type: DataTypes.STRING },
  });
  const TestCard = testDB.define("Card", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    color: { type: DataTypes.STRING },
    value: { type: DataTypes.STRING },
    gameId: { type: DataTypes.INTEGER },
  });
  return { TestPlayer, TestCard };
};
export const setupTestDB = async (testDB) => {
  await testDB.sync({ force: true });
};

export const cleanupTestDB = async (testDB) => {
  await testDB.drop();
  await testDB.close();
};

export const TestDataFactory = {
  createPlayer(overrides = {}) {
    const random = Math.floor(Math.random() * 100000);
    return {
      name: "Player " + random,
      age: 20,
      email: `player${random}@example.com`,
      password: overrides.password || "password123",
      ...overrides,
    };
  },
  createCard(overrides = {}) {
    return {
      color: "red",
      value: "0",
      gameId: 1,
      ...overrides,
    };
  },
};
