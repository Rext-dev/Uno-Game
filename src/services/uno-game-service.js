import * as GameService from "./game-service.js";
import GamePlayers from "../models/game-players-model.js";
import GameState from "../models/game-state-model.js";
import Players from "../models/player-model.js";
import {
  GAME_STATUS,
  PLAYER_STATUS,
  GAME_RULES,
  TURN_DIRECTION,
} from "../config/game-constants.js";

/**
 * Create a new UNO game
 * @param {Object} gameData - Game creation data
 * @param {number} creatorId - ID of the player creating the game
 * @returns {Object}
 */
export const createGame = async (gameData, creatorId) => {
  const { title, maxPlayers = GAME_RULES.MAX_PLAYERS, rules } = gameData;

  const game = await GameService.createGame({
    title,
    status: GAME_STATUS.INACTIVE,
    maxPlayers,
    rules,
  creatorId,
  });
  await GamePlayers.create({
    gameId: game.id,
    playerId: creatorId,
    position: 0,
    status: PLAYER_STATUS.WAITING,
  });
  return {
    game_id: game.id,
  };
};

/**
 * Join an existing game
 * @param {number} gameId - Game to join
 * @param {number} playerId - Player joining
 * @returns {Object}
 */
export const joinGame = async (gameId, playerId) => {
  const game = await GameService.getGameById(gameId);
  if (!game) throw new Error("Game not found");
  if (game.status !== GAME_STATUS.INACTIVE) {
    throw new Error("Cannot join game that has already started");
  }

  const existingPlayer = await GamePlayers.findOne({
    where: { gameId, playerId },
  });
  if (existingPlayer) throw new Error("Player already in game");

  const playerCount = await GamePlayers.count({ where: { gameId } });
  if (playerCount >= game.maxPlayers) {
    throw new Error("Game is full");
  }

  await GamePlayers.create({
    gameId,
    playerId,
    position: playerCount,
    status: PLAYER_STATUS.WAITING,
  });

  return await getGameStatus(gameId);
};

/**
 * Leave a game
 * @param {number} gameId - Game to leave
 * @param {number} playerId - Player leaving
 * @returns {Object}
 */
export const leaveGame = async (gameId, playerId) => {
  const gamePlayer = await GamePlayers.findOne({
    where: { gameId, playerId },
  });
  if (!gamePlayer) {
    throw new Error("Player not in game");
  }

  const game = await GameService.getGameById(gameId);
  if (game.status === GAME_STATUS.ACTIVE) {
    gamePlayer.status = PLAYER_STATUS.LEFT;
    gamePlayer.leftAt = new Date();
    await gamePlayer.save();
    const activePlayers = await GamePlayers.count({
      where: {
        gameId,
        status: [PLAYER_STATUS.WAITING, PLAYER_STATUS.PLAYING],
      },
    });
    if (activePlayers < GAME_RULES.MIN_PLAYERS) {
      await GameService.updateGame(gameId, {
        status: GAME_STATUS.FINISHED,
      });
    }
  } else {
    await gamePlayer.destroy();
    const remainingPlayers = await GamePlayers.findAll({
      where: { gameId },
      order: [["position", "ASC"]],
    });

    for (let i = 0; i < remainingPlayers.length; i++) {
      remainingPlayers[i].position = i;
      await remainingPlayers[i].save();
    }
  }

  return await getGameStatus(gameId);
};

/**
 * Start a game
 * @param {number} gameId - Game to start
 * @param {number} creatorId - ID of the player starting the game
 * @returns {Object}
 */
export const startGame = async (gameId, creatorId) => {
  const game = await GameService.getGameById(gameId);
  if (!game) throw new Error("Game not found");
  if (game.creatorId !== creatorId) {
    throw new Error("Only the creator can start the game");
  }

  if (game.status !== GAME_STATUS.INACTIVE) {
    throw new Error("Game already started or finished");
  }
  const playerCount = await GamePlayers.count({ where: { gameId } });
  if (playerCount < GAME_RULES.MIN_PLAYERS) {
    throw new Error(`Need at least ${GAME_RULES.MIN_PLAYERS} players to start`);
  }
  await GameService.updateGame(gameId, { status: GAME_STATUS.ACTIVE });
  await GamePlayers.update(
    { status: PLAYER_STATUS.PLAYING },
    { where: { gameId } }
  );

  await initializeGameState(gameId);
  await dealInitialCards(gameId);
  return await getGameStatus(gameId);
};

/**
 * Finish a game
 * @param {number} gameId - Game to finish
 * @returns {Object}
 */
export const finishGame = async (gameId) => {
  await GameService.updateGame(gameId, { status: GAME_STATUS.FINISHED });
  await GamePlayers.update(
    { status: PLAYER_STATUS.FINISHED },
    { where: { gameId } }
  );
  return await getGameStatus(gameId);
};

/**
 * Get current game status
 * @param {number} gameId - Game ID
 * @returns {Object}
 */
export const getGameStatus = async (gameId) => {
  const game = await GameService.getGameById(gameId);
  if (!game) throw new Error("Game not found");

  const players = await GamePlayers.findAll({
    where: { gameId },
    include: [{ model: Players, as: 'Player', attributes: ["id", "name", "email"] }],
    order: [["position", "ASC"]],
  });
  let gameState = null;
  let topDiscardCard = null;

  if (game.status === GAME_STATUS.ACTIVE) {
    gameState = await GameState.findOne({ where: { gameId } });
    topDiscardCard = gameState?.topDiscardCard || null;
  }

  return {
    game: {
      id: game.id,
      title: game.title,
      status: game.status,
      maxPlayers: game.maxPlayers,
      rules: game.rules,
    },
    players: players.map((gp) => ({
      id: gp.Player.id,
      name: gp.Player.name,
      position: gp.position,
      status: gp.status,
      score: gp.score,
    })),
    currentPlayer: gameState?.currentPlayerPosition || null,
    direction: gameState?.direction || null,
    topDiscardCard,
    currentColor: gameState?.currentColor || null,
  };
};

/**
 * Get players in a game
 * @param {number} gameId - Game ID
 * @returns {Array}
 */
export const getGamePlayers = async (gameId) => {
  const players = await GamePlayers.findAll({
    where: { gameId },
    include: [{ model: Players, as: 'Player', attributes: ["id", "name"] }],
    order: [["position", "ASC"]],
  });

  return players.map((gp) => ({
    id: gp.Player.id,
    name: gp.Player.name,
    position: gp.position,
    status: gp.status,
    score: gp.score,
    joinedAt: gp.joinedAt,
    leftAt: gp.leftAt,
  }));
};

/**
 * Get current player's turn
 * @param {number} gameId - Game ID
 * @returns {Object}
 */
export const getCurrentPlayer = async (gameId) => {
  const gameState = await GameState.findOne({ where: { gameId } });
  if (!gameState) throw new Error("Game not active");

  const currentPlayer = await GamePlayers.findOne({
    where: {
      gameId,
      position: gameState.currentPlayerPosition,
    },
    include: [{ model: Players, as: 'Player', attributes: ["id"] }],
  });

  return {
    id: currentPlayer.Player.id,
  };
};

/**
 * Get top discard card
 * @param {number} gameId - Game ID
 * @returns {Object}
 */
export const getTopDiscardCard = async (gameId) => {
  const gameState = await GameState.findOne({ where: { gameId } });
  return gameState?.topDiscardCard || null;
};

/**
 * Get game scores
 * @param {number} gameId - Game ID
 * @returns {Array}
 */
export const getGameScores = async (gameId) => {
  const players = await GamePlayers.findAll({
    where: { gameId },
    include: [{ model: Players, as: 'Player', attributes: ["id"] }],
    order: [["score", "DESC"]],
  });

  return players.map((gp) => ({
    playerId: gp.Player.id,
    score: gp.score,
  }));
};

const initializeGameState = async (gameId) => {
  await GameState.create({
    gameId,
    currentPlayerPosition: 0,
    direction: TURN_DIRECTION.CLOCKWISE,
    drawStack: 0,
  });
};

const dealInitialCards = async (gameId) => {
  // TODO: Implement card dealing logic
  // 1. Create deck of UNO cards
  // 2. Shuffle deck
  // 3. Deal 7 cards to each player
  // 4. Place first card in discard pile
  console.log(`Dealing initial cards for game ${gameId}`);
};
