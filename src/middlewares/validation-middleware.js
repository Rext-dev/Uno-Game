import Joi from "joi";
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
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
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
    req.body = value;
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
    const { error, value } = schema.validate(req.params,{
      convert: true,
    });
    if (error) {
      return res.status(400).json({
        success: false,
        message: "The params are not valid",
        errors: error.details.map((detail) => ({
          field: detail.path.join("."),
          message: detail.message,
          value: detail.context?.value,
        })),
      });
    }
    req.params = value;
    next();
  };
};
