import { describe, test, expect, beforeEach } from "@jest/globals";
import express from "express";
import request from "supertest";
import cardRoutes from "../../src/routes/card-route.js";
import Card from "../../src/models/card-model.js";
import Games from "../../src/models/games-model.js";
import Player from "../../src/models/player-model.js";
import { GAME_STATUS } from "../../src/config/game-constants.js";

const app = express();
app.use(express.json());
app.use("/api/cards", cardRoutes);

let game, creator;

describe("Card Controller", () => {
  beforeEach(async () => {
    await Card.destroy({ where: {} });
    await Games.destroy({ where: {} });
    await Player.destroy({ where: {} });
    creator = await Player.create({
      name: "Creator",
      age: 31,
      email: "creador@gmail.com",
      password: "pass1234",
    });
    game = await Games.create({
      title: "CtrlGame",
      status: GAME_STATUS.INACTIVE,
      maxPlayers: 4,
      rules: "standard",
      creatorId: creator.id,
    });
  });

  test("POST /api/cards creates card (201)", async () => {
    // Arrange
    const cardData = { color: "red", value: "5", gameId: game.id };

    // Act
    const res = await request(app).post("/api/cards").send(cardData);

    // Assert
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
  });

  test("GET /api/cards returns list (200)", async () => {
    // Arrange
    await Card.create({ color: "blue", value: "6", gameId: game.id });

    // Act
    const res = await request(app).get("/api/cards");

    // Assert
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("GET /api/cards/:id returns 404 if not found", async () => {
    // Arrange
    const invalidId = 9999;

    // Act
    const res = await request(app).get(`/api/cards/${invalidId}`);

    // Assert
    expect(res.status).toBe(404);
  });

  test("GET /api/cards/:id returns card (200)", async () => {
    // Arrange
    const card = await Card.create({
      color: "green",
      value: "7",
      gameId: game.id,
    });

    // Act
    const res = await request(app).get(`/api/cards/${card.id}`);

    // Assert
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(card.id);
  });

  test("PUT /api/cards/:id updates card (200)", async () => {
    // Arrange
    const card = await Card.create({
      color: "yellow",
      value: "2",
      gameId: game.id,
    });
    const updateData = { value: "3" };

    // Act
    const res = await request(app)
      .put(`/api/cards/${card.id}`)
      .send(updateData);

    // Assert
    expect(res.status).toBe(200);
    expect(res.body.value).toBe("3");
  });

  test("PUT /api/cards/:id returns 404 if not found", async () => {
    // Arrange
    const invalidId = 123456;
    const updateData = { value: "3" };

    // Act
    const res = await request(app)
      .put(`/api/cards/${invalidId}`)
      .send(updateData);

    // Assert
    expect(res.status).toBe(404);
  });

  test("DELETE /api/cards/:id deletes card (204)", async () => {
    // Arrange
    const card = await Card.create({
      color: "red",
      value: "8",
      gameId: game.id,
    });

    // Act
    const res = await request(app).delete(`/api/cards/${card.id}`);

    // Assert
    expect(res.status).toBe(204);
  });

  test("DELETE /api/cards/:id returns 404 if not found", async () => {
    // Arrange
    const invalidId = 88888;

    // Act
    const res = await request(app).delete(`/api/cards/${invalidId}`);

    // Assert
    expect(res.status).toBe(404);
  });

  test("POST /api/cards/initialize creates deck (201)", async () => {
    // Arrange
    const deckData = { gameId: game.id };

    // Act
    const res = await request(app).post("/api/cards/initialize").send(deckData);

    // Assert
    expect(res.status).toBe(201);
    expect(res.body.totalCards).toBe(108);
  });

  test("GET /api/cards/deck/:gameId returns shuffled deck (200)", async () => {
    // Arrange
    await request(app).post("/api/cards/initialize").send({ gameId: game.id });

    // Act
    const res = await request(app).get(`/api/cards/deck/${game.id}`);

    // Assert
    expect(res.status).toBe(200);
    expect(res.body.totalCards).toBe(108);
  });
});
