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
    console.error("Error fetching players:", error);
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

    const { password, ...playerWithoutPassword } = player.toJSON();
    res.status(200).json(playerWithoutPassword);
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
 * @param {string} req.body.password - Player password
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export const createPlayer = async (req, res) => {
  try {
    const { name, age, email, password } = req.body;
    const existingPlayer = await PlayerService.getAllPlayers({
      where: { email },
    });
    if (existingPlayer.length > 0) {
      return res
        .status(409)
        .json({ error: "Player with this email already exists" });
    }
    const newPlayer = await PlayerService.createPlayer({
      name,
      age,
      email,
      password,
    });
    const { password: _, ...playerWithoutPassword } = newPlayer.toJSON();
    res.status(201).json(playerWithoutPassword);
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
 * @param {string} [req.body.name] - Player name
 * @param {number} [req.body.age] - Player age
 * @param {string} [req.body.email] - Player email
 * @param {string} [req.body.password] - Player password
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export const updatePlayer = async (req, res) => {
  try {
    const { id } = req.params;
    // TODO: require old password is needed?
    const updateFields = {};
    if (req.body.name) updateFields.name = req.body.name;
    if (req.body.age) updateFields.age = req.body.age;
    if (req.body.email) updateFields.email = req.body.email;
    if (req.body.password) updateFields.password = req.body.password;

    const playerUpdated = await PlayerService.updatePlayer(id, updateFields);

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
