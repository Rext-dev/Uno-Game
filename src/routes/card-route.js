import express from "express";
import * as CardController from "../controllers/card-controller.js";

const router = express.Router();
//TODO MIDDLEWARE
router.get("/", CardController.getAllCards);
router.get("/:id", CardController.getCardById);
router.post("/", CardController.createCard);
router.put("/:id", CardController.updateCard);
router.delete("/:id", CardController.deleteCard);
router.post("/initialize", CardController.initializeDeck);
router.get("/deck/:gameId", CardController.getShuffledDeck);

export default router;
