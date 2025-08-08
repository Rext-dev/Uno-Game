import * as AuthService from "../services/auth-service.js";

/**
 * Login user with email and password
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body data
 * @param {string} req.body.email - User email
 * @param {string} req.body.password - User password
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await AuthService.loginUser(email, password);

    res.status(200).json({
      message: "Login successful",
      user: result.user,
      token: result.token,
    });
  } catch (error) {
    console.error("Login error:", error);
    if (error.message === "Invalid credentials") {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    res.status(500).json({ error: "Error during login" });
  }
};

/**
 * Get current authenticated user data
 * @param {Object} req - Express request object
 * @param {Object} req.user - User data from JWT middleware
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export const getUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await AuthService.getUserById(userId);
    res.status(200).json({ user });
  } catch (error) {
    if (error.message === "User not found") {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(500).json({ error: "Error fetching user data" });
  }
};

/**
 * Logout user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export const logout = async (req, res) => {
  try {
    res.status(200).json({
      message: "Logout successful.",
    });
  } catch (error) {
    res.status(500).json({ error: "Error during logout" });
  }
};
