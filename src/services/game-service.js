import Games from "../models/games-model.js";

/**
 * Creates a new game in the database.
 * @param {Object} gameData - The data for the new game
 * @param {string} gameData.title - Game title
 * @param {string} gameData.status - Game status
 * @param {number} gameData.maxPlayers - Maximum number of players
 * @returns {Promise<Games>} The created game
 */
export const createGame = async (gameData) => {
  return await Games.create(gameData);
};

/**
 * Gets all games from the database.
 * @param {Object} [options] - Query options
 * @param {string} [options.status] - Filter by status
 * @returns {Promise<Games[]>} A list of all games
 */
export const getAllGames = async (options = {}) => {
  const whereClause = {};
  
  if (options.status) {
    whereClause.status = options.status;
  }
  
  return await Games.findAll({ 
    where: whereClause,
    order: [['createdAt', 'DESC']]
  });
};

/**
 * Gets a game by its ID.
 * @param {number} id - The ID of the game to get
 * @returns {Promise<Games|null>} The found game or null if not found
 */
export const getGameById = async (id) => {
  return await Games.findByPk(id);
};

/**
 * Updates a game by its ID.
 * @param {number} id - The ID of the game to update
 * @param {Object} gameData - The new data for the game
 * @param {string} [gameData.title] - Game title
 * @param {string} [gameData.status] - Game status
 * @param {number} [gameData.maxPlayers] - Maximum number of players
 * @returns {Promise<Games|null>} The updated game or null if not found
 */
export const updateGame = async (id, gameData) => {
  const game = await Games.findByPk(id);
  if (!game) {
    return null;
  }
  await game.update(gameData);
  return game;
};

/**
 * Deletes a game by its ID.
 * @param {number} id - The ID of the game to delete
 * @returns {Promise<boolean>} True if the game was deleted, false otherwise
 */
export const deleteGame = async (id) => {
  const game = await Games.findByPk(id);
  if (!game) {
    return false;
  }
  await game.destroy();
  return true;
};