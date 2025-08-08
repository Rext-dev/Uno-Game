import * as ScoreService from "../services/score-service.js";

/**
 * @async
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body data
 * @param {number} req.body.score - Score obtained in game
 * @param {number} req.body.playerId - Player that scored the score
 * @param {number} req.body.gameId - Game id that this score belong
 * @param {Object} res Express response object
 */
export const createScore = async (req, res) => {
  try {
    const { score, playerId, gameId } = req.body;
    const newScoreRecord = await ScoreService.createScore({
      score,
      playerId,
      gameId,
    });
    res.status(201).json(newScoreRecord);
  } catch (error) {
    res.status(500).json({ error: "Error recording a new score" });
  }
};

/**
 * Get a score by ID
 * @async
 * @param {Object} req - Express request object
 * @param {string} req.params.id - The ID of the score to get
 * @param {Object} res - Express response object
 *
 */
export const getScoreById = async (req, res) => {
  try {
    const { id } = req.params;
    const score = await ScoreService.getScoreById(id);

    if (!score) {
      return res.status(404).json({ error: "Score not found" });
    }

    res.status(200).json(score);
  } catch (error) {
    res.status(500).json({ error: "Error fetching score" });
  }
};

/**
 * Update a Score by ID
 * @async
 * @param {Object} req - Express request object
 * @param {string} req.params.id - The ID of the Score to update
 * @param {Object} req.body - Request body data
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 * @
 * @
 */
export const updateScore = async (req, res) => {
  try {
    const { id } = req.params;
    const scoreData = req.body;

    const updatedScore = await ScoreService.updateScore(id, scoreData);

    if (!updatedScore) {
      return res.status(404).json({ error: "Score not found" });
    }

    res.status(200).json(updatedScore);
  } catch (error) {
    res.status(500).json({ error: "Error updating score" });
  }
};

/**
 * Delete a score by ID
 * @async
 * @param {Object} req - Express request object
 * @param {string} req.params.id - The ID of the score to delete
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export const deleteScore = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ScoreService.deleteScore(id);

    if (!deleted) {
      return res.status(404).json({ error: "Score not found" });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Error deleting score" });
  }
};
