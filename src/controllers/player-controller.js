import * as PlayerService from "../services/player-service.js";

/**
 * Get all players.
 * 
 * @async
 * @function getAllPlayers
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object  
 * @returns {Promise<void>}
 */
export const getAllPlayers = async (req, res) => {
  try {
    const players = await PlayerService.getAllPlayers();
    res.status(200).json(players);
  } catch (error) {
    res.status(500).json({ error: "Error fetching players" });
  }
};

/**
 * Get a player by ID.
 * 
 * @async
 * @function getPlayerById
 * @param {Object} req - Express request object
 * @param {string} req.params.id - The ID of the player to get
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export const getPlayerById = async (req, res) => {
  try {
    const { id } = req.params;
    const player = await PlayerService.getPlayerById(id);

    if (!player) {
      return res.status(404).json({ error: "Player not found" });
    }
    res.status(200).json(player);
  } catch (error) {
    res.status(500).json({ error: "Error fetching player" });
  }
};

/**
 * Create a new player.
 * 
 * @async
 * @function createPlayer
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body data
 * @param {string} req.body.name - Player name
 * @param {number} req.body.age - Player age
 * @param {string} req.body.email - Player email
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export const createPlayer = async (req, res) => {
  try {
    const { name, age, email } = req.body;
    //TODO: manejar error, cuando se crea un nuevo jugador con el mismo email, devolver 409
    const newPlayer = await PlayerService.createPlayer({
      name,
      age,
      email,
    });
    res.status(201).json(newPlayer);
  } catch (error) {
    console.error("Error creating player:", error);
    res.status(500).json({ error: "Error creating the player" });
  }
};

/**
 * Update a player by ID.
 * @async
 * @function updatePlayer
 * @param {Object} req - Express request object
 * @param {string} req.params.id - The ID of the player to update
 * @param {Object} req.body - Request body data
 * @param {string} req.body.name - Player name
 * @param {number} req.body.age - Player age
 * @param {string} req.body.email - Player email
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export const updatePlayer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, age, email } = req.body;
    const playerUpdated = await PlayerService.updatePlayer(id, {
      name,
      age,
      email,
    });
    if (!playerUpdated) {
      return res.status(404).json({ error: "Player not found" });
    }
    res.status(200).json(playerUpdated);
  } catch (error) {
    res.status(500).json({ error: "Error updating the player" });
  }
};

/**
 * Delete a player by ID
 * 
 * @async
 * @function deletePlayer
 * @param {Object} req - Express request object
 * @param {string} req.params.id - The ID of the player to delete
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export const deletePlayer = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await PlayerService.deletePlayer(id);
    if (!deleted) {
      return res.status(404).json({ error: "Player not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Error deleting the player" });
  }
}; 