import * as UnoGameService from "../services/uno-game-service.js";

/**
 * Creates a new game.
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body data
 * @param {string} req.body.title - Game title
 * @param {number} req.body.maxPlayers - Maximum number of players
 * @param {string} req.body.rules - Game rules
 * @param {Object} res - Express response object
 */
export const createGame = async (req, res) => {
  try {
    const { title, maxPlayers, rules } = req.body;
    const creatorId = req.user.id;

    const gameData = await UnoGameService.createGame(
      { title, maxPlayers, rules },
      creatorId
    );
    res.status(201).json({
      success: true,
      message: "Game created successfully",
      data: gameData,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

/**
 * Join an existing game
 * @param {Request} req
 * @param {number} req.params.id - ID of the game to join
 * @param {Response} res
 */
export const joinGame = async (req, res) => {
  try {
    const gameId = req.params.id;
    const playerId = req.user.id;

    const gameData = await UnoGameService.joinGame(gameId, playerId);

    res.status(200).json({
      success: true,
      message: "Successfully joined game",
      data: gameData,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

/**
 * Leave a game
 * @param {Request} req
 * @param {Response} res
 */
export const leaveGame = async (req, res) => {
  try {
    const gameId = req.params.id;
    const playerId = req.user.id;
    const gameData = await UnoGameService.leaveGame(gameId, playerId);

    res.status(200).json({
      success: true,
      message: "Successfully left game",
      data: gameData,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

/**
 * Start a game
 * @param {Request} req
 * @param {Response} res
 */
export const startGame = async (req, res) => {
  try {
    const gameId = req.params.id;
    const creatorId = req.user.id;

    const gameData = await UnoGameService.startGame(gameId, creatorId);

    res.status(200).json({
      success: true,
      message: "Game started successfully",
      data: gameData,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

/**
 * Finish a game
 * @param {Request} req
 * @param {Response} res
 */
export const finishGame = async (req, res) => {
  try {
    const gameId = parseInt(req.params.id);
    const gameData = await UnoGameService.finishGame(gameId);

    res.status(200).json({
      success: true,
      message: "Game finished",
      data: gameData,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

/**
 * Get game status
 * @param {Request} req
 * @param {Response} res
 */
export const getGameStatus = async (req, res) => {
  try {
    const gameId = req.params.id;
    const gameData = await UnoGameService.getGameStatus(gameId);

    res.status(200).json({
      success: true,
      message: "Game status retrieved",
      data: gameData,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

/**
 * Get players in a game
 * @param {Request} req
 * @param {Response} res
 */
export const getGamePlayers = async (req, res) => {
  try {
    const gameId = req.params.id;
    const players = await UnoGameService.getGamePlayers(gameId);

    res.status(200).json({
      success: true,
      message: "Game players",
      data: players,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

/**
 * Get current player's turn
 * @param {Request} req
 * @param {Response} res
 */
export const getCurrentPlayer = async (req, res) => {
  try {
    const gameId = parseInt(req.params.id);

    const currentPlayer = await UnoGameService.getCurrentPlayer(gameId);

    res.status(200).json({
      success: true,
      message: "Current player",
      data: currentPlayer,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

/**
 * Get top discard card
 * @param {Request} req
 * @param {Response} res
 */
export const getTopDiscardCard = async (req, res) => {
  try {
    const gameId = req.params.id;
    const topCard = await UnoGameService.getTopDiscardCard(gameId);

    res.status(200).json({
      success: true,
      message: "Top discard card",
      data: topCard,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

/**
 * Get game scores
 * @param {Request} req
 * @param {Response} res
 */
export const getGameScores = async (req, res) => {
  try {
    const gameId = req.params.id;
    const scores = await UnoGameService.getGameScores(gameId);

    res.status(200).json({
      success: true,
      message: "Game scores",
      data: scores,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};
