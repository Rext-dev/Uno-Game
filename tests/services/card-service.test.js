import { describe, test, expect, beforeEach } from "@jest/globals";
import Card from "../../src/models/card-model.js";
import Games from "../../src/models/games-model.js";
import Player from "../../src/models/player-model.js";
import * as CardService from "../../src/services/card-service.js";
import { GAME_STATUS } from "../../src/config/game-constants.js";

let game, creator;

describe("Card Service", () => {
  beforeEach(async () => {
    await Card.destroy({ where: {} });
    await Games.destroy({ where: {} });
    await Player.destroy({ where: {} });
    creator = await Player.create({
      name: "Creator",
      age: 30,
      email: "c@test.com",
      password: "pass1234",
    });
    game = await Games.create({
      title: "Test Game",
      status: GAME_STATUS.INACTIVE,
      maxPlayers: 4,
      rules: "standard",
      creatorId: creator.id,
    });
  });

  test("createCard creates a card", async () => {
    // Arrange
    const cardData = { color: "red", value: "5", gameId: game.id };

    // Act
    const card = await CardService.createCard(cardData);

    // Assert
    expect(card.id).toBeDefined();
    expect(card.color).toBe("red");
  });

  test("getAllCards returns all cards", async () => {
    // Arrange
    await CardService.createCard({ color: "red", value: "5", gameId: game.id });
    await CardService.createCard({
      color: "blue",
      value: "Skip",
      gameId: game.id,
    });

    // Act
    const cards = await CardService.getAllCards();

    // Assert
    expect(cards.length).toBe(2);
  });

  test("getAllCards filters by gameId", async () => {
    // Arrange
    const game2 = await Games.create({
      title: "Game2",
      status: GAME_STATUS.INACTIVE,
      maxPlayers: 4,
      rules: "standard",
      creatorId: creator.id,
    });
    await CardService.createCard({ color: "red", value: "5", gameId: game.id });
    await CardService.createCard({
      color: "blue",
      value: "Skip",
      gameId: game2.id,
    });

    // Act
    const cards = await CardService.getAllCards(game.id);

    // Assert
    expect(cards.length).toBe(1);
  });

  test("getCardById returns the card", async () => {
    // Arrange
    const created = await CardService.createCard({
      color: "green",
      value: "7",
      gameId: game.id,
    });

    // Act
    const found = await CardService.getCardById(created.id);

    // Assert
    expect(found.id).toBe(created.id);
  });

  test("updateCard updates and returns card", async () => {
    // Arrange
    const created = await CardService.createCard({
      color: "yellow",
      value: "2",
      gameId: game.id,
    });
    const updateData = { value: "3" };

    // Act
    const updated = await CardService.updateCard(created.id, updateData);

    // Assert
    expect(updated.value).toBe("3");
  });

  test("updateCard returns null if not found", async () => {
    // Arrange
    const invalidId = 9999;
    const updateData = { value: "3" };

    // Act
    const updated = await CardService.updateCard(invalidId, updateData);

    // Assert
    expect(updated).toBeNull();
  });

  test("deleteCard deletes and returns true", async () => {
    // Arrange
    const created = await CardService.createCard({
      color: "red",
      value: "8",
      gameId: game.id,
    });

    // Act
    const result = await CardService.deleteCard(created.id);

    // Assert
    expect(result).toBe(true);
  });

  test("deleteCard returns false if not found", async () => {
    // Arrange
    const invalidId = 9999;

    // Act
    const result = await CardService.deleteCard(invalidId);

    // Assert
    expect(result).toBe(false);
  });

  test("initializeDeck creates 108 shuffled cards", async () => {
    // Arrange
    // Act
    const deck = await CardService.initializeDeck(game.id);

    // Assert
    expect(deck.length).toBe(108);
    const colors = new Set(deck.map((c) => c.color));
    expect(colors.has("red")).toBe(true);
  });

  test("getShuffledDeck returns shuffled deck", async () => {
    // Arrange
    await CardService.initializeDeck(game.id);

    // Act
    const deck1 = await CardService.getShuffledDeck(game.id);
    const deck2 = await CardService.getShuffledDeck(game.id);

    // Assert
    expect(deck1.length).toBe(108);
    expect(deck2.length).toBe(108);
    const sameOrder = deck1.every((c, i) => c.id === deck2[i].id);
    expect(sameOrder).toBe(false);
  });
});
