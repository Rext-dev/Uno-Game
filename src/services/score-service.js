import Score from "../models/score-model.js";

/**
 * Creates a new score record
 *
 * @async
 * @param {Object} scoreData - The data for the new score
 * @param {number} scoreData.score - Points scored by player
 * @param {number} scoreData.playerId - ID of the player
 * @param {number} scoreData.gameId - ID of the game
 * @returns {Promise<Score>} The created score record
 */
export const createScore = async (scoreData) => {
  // TODO: validar que playerId exista en la base de datos
  // TODO: validar que gameId exista en la base de datos  
  // TODO: verificar que el jugador haya participado en ese juego
  // TODO: prevenir duplicación de scores para el mismo player+game
  return await Score.create(scoreData);
};

/**
 * Get all scores
 * Can be filtered by playerId or gameId.
 *
 * @async
 * @param {Object} [filters] - Optional filters
 * @param {number} [filters.playerId] - Filter by player ID
 * @param {number} [filters.gameId] - Filter by game ID
 * @returns {Promise<Score[]>} List of scores
 */
export const getAllScores = async (filters = {}) => {
  const whereClause = {};

  if (filters.playerId) {
    // TODO: validar que playerId sea un número válido
    whereClause.playerId = filters.playerId;
  }

  if (filters.gameId) {
    // TODO: validar que gameId sea un número válido
    whereClause.gameId = filters.gameId;
  }

  return await Score.findAll({
    where: whereClause,
    order: [["date", "DESC"]],
  });
};

/**
 * Get a score by ID.
 *
 * @async
 * @param {number} id - The ID of the score to get
 * @returns {Promise<Score|null>} The score or null if not found
 */
export const getScoreById = async (id) => {
  return await Score.findByPk(id);
};

/**
 * Update a score record.
 *
 * @async
 * @param {number} id - The ID of the score to update
 * @param {Object} scoreData - New data for the score
 * @returns {Promise<Score|null>} Updated score or null if not found
 */
export const updateScore = async (id, scoreData) => {
  const score = await Score.findByPk(id);
  if (!score) {
    return null;
  }
  await score.update(scoreData);
  return score;
};

/**
 * Delete a score record.
 * @async
 * @param {number} id - The ID of the score to delete
 * @returns {Promise<boolean>} True if deleted, false if not found
 */
export const deleteScore = async (id) => {
  const score = await Score.findByPk(id);
  if (!score) {
    return false;
  }
  await score.destroy();
  return true;
};
