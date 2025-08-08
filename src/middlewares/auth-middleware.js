import Joi from "joi";
import { verifyToken } from "../config/jwt-config.js";

/**
 * Middleware to validate JWT tokens in body
 * @param {Joi.Schema} schema - Model to compare with body
 * @returns {Function}
 */
export const validateJWT = (schema) => {
  return (req, res, next) => {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Request body is missing or empty",
        errors: [],
      });
    }
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      allowUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
        value: detail.context?.value,
      }));

      return res.status(400).json({
        success: false,
        message: "The body is not valid",
        errors,
      });
    }

    const token = value.access_token;
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    try {
      const decoded = verifyToken(token);
      req.user = decoded;
      req.body = value;
      next();
    } catch (error) {
      return res.status(401).json({ error: "Invalid token" });
    }
  };
};
