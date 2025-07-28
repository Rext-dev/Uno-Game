import express from "express";
import * as ScoreController from "../controllers/score-controller.js";
//import { validateScore } from "../middleware/game-validator.js";

const router = express.Router();

router.post("/", ScoreController.createScore);
router.get("/:id", ScoreController.getScoreById);
router.put("/:id", ScoreController.updateScore);
router.delete("/:id", ScoreController.deleteScore);

export default router;
