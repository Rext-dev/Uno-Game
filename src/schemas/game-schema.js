import Joi from "joi";

export const createGameSchema = Joi.object({
  title: Joi.string().min(1).max(100).required(),
  maxPlayers: Joi.number().min(1).required().max(4),
  rules: Joi.string().required(),
});

export const updatePlayerSchema = createGameSchema.fork(
  ["title", "maxPlayers", "rules"],
  (schema) => schema.optional()
);

export const paramGameSchema = Joi.object({
  id: Joi.number().integer().min(1).required(),
});
