import Joi from "joi";
import { validateWithJoi } from "../utils/fp.js";
/**
 * Compare body with a Model
 * @param {Joi.Schema} schema - Model to compare with body
 * @returns
 */
export const validateBody = (schema) => {
  return (req, res, next) => {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Request body is missing or empty",
        errors: [],
      });
    }
    const result = validateWithJoi(schema, req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    const response = result.fold(
      (errors) => ({ ok: false, errors }),
      (value) => ({ ok: true, value })
    );

    if (!response.ok) {
      return res.status(400).json({
        success: false,
        message: "The body is not valid",
        errors: response.errors,
      });
    }
    req.body = response.value;
    next();
  };
};

/**
 * Validate request parameters against a Joi schema
 * @param {Joi.Schema} schema - Joi schema to validate against
 * @returns
 */
export const validateParams = (schema) => {
  return (req, res, next) => {
  const result = validateWithJoi(schema, req.params, { convert: true });
  const response = result.fold(
    (errors) => ({ ok: false, errors }),
    (value) => ({ ok: true, value })
  );
  if (!response.ok) {
    return res.status(400).json({
      success: false,
      message: "The params are not valid",
      errors: response.errors,
    });
  }
    req.params = response.value;
    next();
  };
};
