import Joi from "joi";
// schema is similar to a DTO

export const createPlayerSchema = Joi.object({
  name: Joi.string().min(1).max(100).required().messages({
    "string.empty": "The username is required",
    "string.min": "The name must have at least 1 character",
    "string.max": "The name is too long, max 100 characters",
  }),
  age: Joi.number().integer().min(0).required().messages({
    "number.base": "The age must be a number",
    "number.integer": "The age must be an integer",
    "number.min": "The age cannot be negative",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "The email must be a valid email address",
    "string.empty": "The email is required",
  }),
  password: Joi.string().min(6).max(100).required().messages({
    "string.empty": "The password is required",
    "string.min": "The password must have at least 6 characters",
    "string.max": "The password is too long, max 100 characters",
  }),
});

export const updatePlayerSchema = createPlayerSchema.fork(
  ["name", "age", "email", "password"],
  (schema) => schema.optional()
);

export const paramPlayerSchema = Joi.object({
  id: Joi.number().integer().min(1).required().messages({
    "number.base": "The id must be a number",
    "number.integer": "The id must be an integer",
    "number.min": "The id must be a positive number",
  }),
});

export const loginPlayerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "The email must be a valid email address",
    "string.empty": "The email is required",
  }),
  password: Joi.string().min(6).max(100).required().messages({
    "string.empty": "The password is required",
    "string.min": "The password must have at least 6 characters",
    "string.max": "The password is too long, max 100 characters",
  }),
});