import express from "express";
import {
  createGame,
  deleteGame,
  getAllGames,
  getGameById,
  updateGame,
  patchGame,
} from "../controllers/game-controller.js";
import validateGame from "../middleware/game-validator.js";

const router = express.Router();

router.get("/", getAllGames);
router.get("/:id", getGameById);
router.post("/", validateGame, createGame);
router.put("/:id", validateGame, updateGame);
router.patch("/:id", patchGame);
router.delete("/:id", deleteGame);

export default router;
