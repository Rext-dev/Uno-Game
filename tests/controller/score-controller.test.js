import { describe, test, expect, beforeEach } from "@jest/globals";
import express from "express";
import request from "supertest";
import scoreRoutes from "../../src/routes/score-route.js";
import Score from "../../src/models/score-model.js";
import Games from "../../src/models/games-model.js";
import Player from "../../src/models/player-model.js";
import { GAME_STATUS } from "../../src/config/game-constants.js";

const app = express();
app.use(express.json());
app.use("/api/scores", scoreRoutes);

let player, game, creator;

describe("Score Controller", () => {
  beforeEach(async () => {
    await Score.destroy({ where: {} });
    await Games.destroy({ where: {} });
    await Player.destroy({ where: {} });
    creator = await Player.create({
      name: "Creator",
      age: 33,
      email: "Cuenta1@gmail.com",
      password: "pass1234",
    });
    game = await Games.create({
      title: "ScoreCtrlGame",
      status: GAME_STATUS.INACTIVE,
      maxPlayers: 4,
      rules: "standard",
      creatorId: creator.id,
    });
    player = await Player.create({
      name: "CtrlScorer",
      age: 21,
      email: "Cuenta2@gmail.com",
      password: "pass1234",
    });
  });

  test("POST /api/scores creates score (201)", async () => {
    // Arrange
    const scoreData = { score: 100, playerId: player.id, gameId: game.id };

    // Act
    const res = await request(app).post("/api/scores").send(scoreData);

    // Assert
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
  });

  test("GET /api/scores/:id returns 404 if not found", async () => {
    // Arrange
    const invalidId = 9999;

    // Act
    const res = await request(app).get(`/api/scores/${invalidId}`);

    // Assert
    expect(res.status).toBe(404);
  });

  test("GET /api/scores/:id returns score (200)", async () => {
    // Arrange
    const s = await Score.create({
      score: 10,
      playerId: player.id,
      gameId: game.id,
      date: new Date(),
    });

    // Act
    const res = await request(app).get(`/api/scores/${s.id}`);

    // Assert
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(s.id);
  });

  test("PUT /api/scores/:id updates score (200)", async () => {
    // Arrange
    const s = await Score.create({
      score: 10,
      playerId: player.id,
      gameId: game.id,
      date: new Date(),
    });
    const updateData = { score: 25 };

    // Act
    const res = await request(app).put(`/api/scores/${s.id}`).send(updateData);

    // Assert
    expect(res.status).toBe(200);
    expect(res.body.score).toBe(25);
  });

  test("PUT /api/scores/:id returns 404 if not found", async () => {
    // Arrange
    const invalidId = 123456;
    const updateData = { score: 33 };

    // Act
    const res = await request(app)
      .put(`/api/scores/${invalidId}`)
      .send(updateData);

    // Assert
    expect(res.status).toBe(404);
  });

  test("DELETE /api/scores/:id deletes score (204)", async () => {
    // Arrange
    const s = await Score.create({
      score: 10,
      playerId: player.id,
      gameId: game.id,
      date: new Date(),
    });

    // Act
    const res = await request(app).delete(`/api/scores/${s.id}`);

    // Assert
    expect(res.status).toBe(204);
  });

  test("DELETE /api/scores/:id returns 404 if not found", async () => {
    // Arrange
    const invalidId = 77777;

    // Act
    const res = await request(app).delete(`/api/scores/${invalidId}`);

    // Assert
    expect(res.status).toBe(404);
  });
});
