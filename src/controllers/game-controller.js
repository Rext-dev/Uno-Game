import * as GameService from "../services/game-service.js";

// TODO: Implementar paginacion

/**
 * Get all games
 * 
 * @route GET /api/games
 * @param {Object} req - Express request object
 * @param {string} [req.query.status] - Optional status filter
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 * @status 200 - Games retrieved successfully
 * @status 500 - Internal server error
 */
export const getAllGames = async (req, res) => {
  try {
    const { status } = req.query;
    const games = await GameService.getAllGames({ status });
    res.status(200).json(games);
  } catch (error) {
    res.status(500).json({ error: "Error fetching games" });
  }
};

/**
 * Retrieves a game by its ID.
 *
 * @route GET /api/games/:id
 * @param {Object} req - Express request object
 * @param {string} req.params.id - The ID of the game to retrieve
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 * @status 200 - Game found and returned
 * @status 404 - Game not found
 * @status 500 - Internal server error
 */
export const getGameById = async (req, res) => {
  try {
    const { id } = req.params;
    // TODO: validar que id sea un numero valido
    const game = await GameService.getGameById(id);

    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }
    res.status(200).json(game);
  } catch (error) {
    res.status(500).json({ error: "Error fetching game" });
  }
};

/**
 * Updates a complete game by its ID.
 * 
 * @route PUT /api/games/:id
 * @param {Object} req - Express request object
 * @param {string} req.params.id - The ID of the game to update
 * @param {Object} req.body - Request body data
 * @param {string} [req.body.title] - Game title
 * @param {string} [req.body.status] - Game status (active/inactive)
 * @param {number} [req.body.maxPlayers] - Maximum number of players
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 * @status 200 - Game updated successfully
 * @status 404 - Game not found
 * @status 500 - Internal server error
 */
export const updateGame = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, status, maxPlayers } = req.body;

    const updatedGame = await GameService.updateGame(id, {
      title,
      status,
      maxPlayers,
    });

    if (!updatedGame) {
      return res.status(404).json({ error: "Game not found" });
    }

    res.status(200).json(updatedGame);
  } catch (error) {
    res.status(500).json({ error: "Error updating the game" });
  }
};

/**
 * Deletes a game by its ID
 * @route DELETE /api/games/:id
 * @param {Object} req - Express request object
 * @param {string} req.params.id - The ID of the game to delete
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 * @status 204 - Game deleted successfully
 * @status 404 - Game not found
 * @status 500 - Internal server error
 */
export const deleteGame = async (req, res) => {
  try {
    const { id } = req.params;
    const success = await GameService.deleteGame(id);

    if (!success) {
      return res.status(404).json({ error: "Game not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Error deleting the game" });
  }
};

/**
 * Partially updates a game by its ID in the database.
 * 
 * @route PATCH /api/games/:id
 * @param {Object} req - Express request object
 * @param {string} req.params.id - The ID of the game to patch
 * @param {Object} req.body - Request body data (partial update)
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 * @status 200 - Game patched successfully
 * @status 404 - Game not found
 * @status 500 - Internal server error
 */
export const patchGame = async (req, res) => {
  try {
    const { id } = req.params;
    const gameData = req.body;
    const updatedGame = await GameService.updateGame(id, gameData);

    if (!updatedGame) {
      return res.status(404).json({ error: "Game not found" });
    }

    res.status(200).json(updatedGame);
  } catch (error) {
    res.status(500).json({ error: "Error patching the game" });
  }
};
