import express from "express";
import * as UnoGameController from "../controllers/uno-game-controller.js";
import { validateJWT } from "../middlewares/auth-middleware.js";
import { accessTokenSchema } from "../schemas/auth-schema.js";
import {
  validateBody,
  validateParams,
} from "../middlewares/validation-middleware.js";
import { createGameSchema, paramGameSchema } from "../schemas/game-schema.js";

const router = express.Router();

router.post(
  "/",
  validateJWT(accessTokenSchema),
  validateBody(createGameSchema),
  UnoGameController.createGame
);
router.post(
  "/:id/join",
  validateJWT(accessTokenSchema),
  validateParams(paramGameSchema),
  UnoGameController.joinGame
);

router.post(
  "/:id/leave",
  validateJWT(accessTokenSchema),
  validateParams(paramGameSchema),
  UnoGameController.leaveGame
);

router.post(
  "/:id/start",
  validateJWT(accessTokenSchema),
  validateParams(paramGameSchema),
  UnoGameController.startGame
);
router.post(
  "/:id/finish",
  validateJWT(accessTokenSchema),
  validateParams(paramGameSchema),
  UnoGameController.finishGame
);

router.get(
  "/:id/status",
  validateParams(paramGameSchema),
  UnoGameController.getGameStatus
);

router.get(
  "/:id/players",
  validateParams(paramGameSchema),
  UnoGameController.getGamePlayers
);

router.get(
  "/:id/current-player",
  validateParams(paramGameSchema),
  UnoGameController.getCurrentPlayer
);

router.get(
  "/:id/top-card",
  validateParams(paramGameSchema),
  UnoGameController.getTopDiscardCard
);

router.get(
  "/:id/scores",
  validateParams(paramGameSchema),
  UnoGameController.getGameScores
);

export default router;
