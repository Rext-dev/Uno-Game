import Player from "../models/player-model.js";
import { SequelizePlayerRepository } from "../infrastructure/repositories/sequelize-player-repository.js";

let repository = new SequelizePlayerRepository();

export const setPlayerRepository = (repo) => {
  repository = repo;
};

/**
 * Creates a new player in the database.
 * @async
 * @param {Object} playerData - The data for the new player
 * @param {string} playerData.name - The player's name
 * @param {number} playerData.age - The player's age
 * @param {string} playerData.email - The player's email address
 * @param {string} playerData.password - The player's password
 * @returns {Promise<Player>} - The created player
 */
export const createPlayer = async (playerData) => {
  return await repository.create(playerData);
};

/**
 * Retrieves all players from the database.
 * @async
 * @param {Object} [options] - Optional query options
 * @returns {Promise<Player[]>} - A list of all players
 */
export const getAllPlayers = async (options) => {
  return await repository.findAll(options);
};

/**
 * Retrieves a player by their ID from the database.
 * @async
 * @param {number} id - The ID of the player to retrieve
 * @returns {Promise<Player|null>} - The player with the specified ID, or null if not found
 */
export const getPlayerById = async (id) => {
  return await repository.findById(id);
};

/**
 * Updates a player in the database.
 * @async
 * @param {number} id - The ID of the player to update
 * @param {Object} playerData - The new data for the player
 * @param {string} [playerData.name] - The player's name
 * @param {number} [playerData.age] - The player's age
 * @param {string} [playerData.email] - The player's email address
 * @param {string} [playerData.password] - The player's password
 * @returns {Promise<Player|null>} - The updated player, or null if not found
 */
export const updatePlayer = async (id, playerData) => {
  return await repository.update(id, playerData);
};

/**
 * Deletes a player from the database.
 * @async
 * @param {number} id - The ID of the player to delete
 * @returns {Promise<boolean>} - True if the player was deleted, false if not found
 */
export const deletePlayer = async (id) => {
  return await repository.delete(id);
};
