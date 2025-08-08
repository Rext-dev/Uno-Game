import express from "express";
import * as PlayerController from "../controllers/player-controller.js";
import {
  validateBody,
  validateParams,
} from "../middlewares/validation-middleware.js";
import {
  paramPlayerSchema,
  createPlayerSchema,
  updatePlayerSchema,
} from "../schemas/player-schemas.js";

const router = express.Router();

router.get("/", PlayerController.getAllPlayers);
router.get(
  "/:id",
  validateParams(paramPlayerSchema),
  PlayerController.getPlayerById
);
router.post(
  "/",
  validateBody(createPlayerSchema),
  PlayerController.createPlayer
);
router.put(
  "/:id",
  validateParams(paramPlayerSchema),
  validateBody(updatePlayerSchema),
  PlayerController.updatePlayer
);
router.delete(
  "/:id",
  validateParams(paramPlayerSchema),
  PlayerController.deletePlayer
);

export default router;
