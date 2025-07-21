import express from 'express';
import { createGame, deleteGame, getGameById, updateGame } from '../controllers/game-controller.js';
import validateGame from '../middleware/game-validator.js';

const router = express.Router();

router.get('/:id', getGameById);
router.post('/', validateGame, createGame);
router.put('/:id', validateGame, updateGame);
router.delete('/:id', deleteGame);
router.patch('/:id', updateGame);

export default router;