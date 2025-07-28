import express from "express";
import * as GameController from "../controllers/game-controller.js";
//import { validateUnoGame } from "../middleware/game-validator.js";

const router = express.Router();

router.get('/', GameController.getAllGames);
router.get('/:id', GameController.getGameById);
router.post('/', GameController.createGame);
router.put('/:id', GameController.updateGame);
router.delete('/:id', GameController.deleteGame);
router.patch('/:id', GameController.patchGame);

export default router;
