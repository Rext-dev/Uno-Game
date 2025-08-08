import Joi from "joi";

export const accessTokenSchema = Joi.object({
  access_token: Joi.string().min(1).required().messages({
    "string.empty": "The access token is required",
    "string.min": "The access token must have at least 1 character",
  }),
});
