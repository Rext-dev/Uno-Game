import Player from "../models/player-model.js";
import { generateToken } from "../config/jwt-config.js";

/**
 * Authenticate user with email and password
 * @async
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>}
 */
export const loginUser = async (email, password) => {
  const user = await Player.findOne({
    where: { email },
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isValidPassword = await user.comparePassword(password);
  if (!isValidPassword) {
    throw new Error("Invalid credentials");
  }

  const token = generateToken({
    id: user.id,
    email: user.email,
    name: user.name,
  });
  const { password: _, ...userWithoutPassword } = user.toJSON();

  return {
    user: userWithoutPassword,
    token,
  };
};

/**
 * Get user by ID
 * @param {number} userId - User ID
 * @returns {Promise<Object>}
 */
export const getUserById = async (userId) => {
  const user = await Player.findByPk(userId, {
    attributes: { exclude: ["password"] },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user.toJSON();
};
