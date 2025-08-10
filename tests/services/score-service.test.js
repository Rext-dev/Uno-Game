import { describe, test, expect, beforeEach } from "@jest/globals";
import Score from "../../src/models/score-model.js";
import Games from "../../src/models/games-model.js";
import Player from "../../src/models/player-model.js";
import * as ScoreService from "../../src/services/score-service.js";
import { GAME_STATUS } from "../../src/config/game-constants.js";

let player, game, creator;

describe("Score Service", () => {
  beforeEach(async () => {
    await Score.destroy({ where: {} });
    await Games.destroy({ where: {} });
    await Player.destroy({ where: {} });
    creator = await Player.create({
      name: "Creator",
      age: 28,
      email: "creator@score.com",
      password: "pass1234",
    });
    game = await Games.create({
      title: "ScoreGame",
      status: GAME_STATUS.INACTIVE,
      maxPlayers: 4,
      rules: "standard",
      creatorId: creator.id,
    });
    player = await Player.create({
      name: "Scorer",
      age: 20,
      email: "scorer@example.com",
      password: "pass1234",
    });
  });

  test("createScore creates score", async () => {
    // Arrange
    const scoreData = { score: 50, playerId: player.id, gameId: game.id };

    // Act
    const score = await ScoreService.createScore(scoreData);

    // Assert
    expect(score.id).toBeDefined();
  });

  test("getAllScores filters by playerId", async () => {
    // Arrange
    await ScoreService.createScore({
      score: 10,
      playerId: player.id,
      gameId: game.id,
    });

    // Act
    const scores = await ScoreService.getAllScores({ playerId: player.id });

    // Assert
    expect(scores.length).toBe(1);
  });

  test("getScoreById returns null if not found", async () => {
    // Arrange
    const invalidId = 9999;

    // Act
    const score = await ScoreService.getScoreById(invalidId);

    // Assert
    expect(score).toBeNull();
  });

  test("updateScore updates score", async () => {
    // Arrange
    const s = await ScoreService.createScore({
      score: 10,
      playerId: player.id,
      gameId: game.id,
    });
    const updateData = { score: 20 };

    // Act
    const updated = await ScoreService.updateScore(s.id, updateData);

    // Assert
    expect(updated.score).toBe(20);
  });

  test("updateScore returns null if not found", async () => {
    // Arrange
    const invalidId = 9999;
    const updateData = { score: 30 };

    // Act
    const updated = await ScoreService.updateScore(invalidId, updateData);

    // Assert
    expect(updated).toBeNull();
  });

  test("deleteScore returns true when exists", async () => {
    // Arrange
    const s = await ScoreService.createScore({
      score: 10,
      playerId: player.id,
      gameId: game.id,
    });

    // Act
    const result = await ScoreService.deleteScore(s.id);

    // Assert
    expect(result).toBe(true);
  });

  test("deleteScore returns false when not exists", async () => {
    // Arrange
    const invalidId = 9999;

    // Act
    const result = await ScoreService.deleteScore(invalidId);

    // Assert
    expect(result).toBe(false);
  });
});
