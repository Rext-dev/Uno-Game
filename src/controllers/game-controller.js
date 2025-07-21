import Game from "../models/game-model.js";

// GET /games/:id
export const getGameById = async (req, res) => {
  try {
    const { id } = req.params;
    const game = await Game.findByPk(id);

    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }
    res.status(200).json(game);
  } catch (error) {
    res.status(500).json({ error: "Error fetching game" });
  }
};

// POST /games
export const createGame = async (req, res) => {
  try {
    const { name, description, genre, platform } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Game name is required" });
    }
    const newGame = await Game.create({
      name,
      description,
      genre,
      platform,
    });

    res.status(201).json(newGame);
  } catch (error) {
    res.status(500).json({ error: "Error creating game" });
  }
};

//PUT /games/:id
export const updateGame = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, genre, platform } = req.body;

    const game = await Game.findByPk(id);
    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }
    await game.update({
      name: name || game.name,
      description: description || game.description,
      genre: genre || game.genre,
      platform: platform || game.platform,
    });
    res.status(200).json(game);
  } catch (error) {
    res.status(500).json({ error: "Error updating the game" });
  }
};

// DELETE /games/:id
export const deleteGame = async (req, res) => {
  try {
    const { id } = req.params;
    const game = await Game.findByPk(id);

    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }

    await game.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Error deleting the game" });
  }
};

// PATCH /games/:id
export const patchGame = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, genre, platform } = req.body;
    const game = await Game.findByPk(id);
    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }
    await game.update({
      name: name || game.name,
      description: description || game.description,
      genre: genre || game.genre,
      platform: platform || game.platform,
    });

    res.status(200).json(game);
  } catch (error) {
    res.status(500).json({ error: "Error patching the game" });
  }
}
