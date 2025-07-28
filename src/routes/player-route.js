import express from "express";
import * as PlayerController from "../controllers/player-controller.js";
//TODO: MIDDLEWARE
const router = express.Router();

router.get("/", PlayerController.getAllPlayers);
router.get("/:id", PlayerController.getPlayerById);
router.post("/", PlayerController.createPlayer);
router.put("/:id", PlayerController.updatePlayer);
router.delete("/:id", PlayerController.deletePlayer);

export default router;
