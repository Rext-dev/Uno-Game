import { describe, test, expect, beforeEach } from "@jest/globals";
import * as GameService from "../../src/services/game-service.js";
import Games from "../../src/models/games-model.js";
import Player from "../../src/models/player-model.js";
import { GAME_STATUS } from "../../src/config/game-constants.js";

describe("Game Service", () => {
  let creator;
  beforeEach(async () => {
    await Games.destroy({ where: {} });
    await Player.destroy({ where: {} });
    creator = await Player.create({
      name: "Creator",
      age: 25,
      email: "creator@g.com",
      password: "pass1234",
    });
  });

  test("createGame creates a game", async () => {
    // Arrange
    const gameData = {
      title: "G1",
      status: GAME_STATUS.INACTIVE,
      maxPlayers: 4,
      rules: "std",
      creatorId: creator.id,
    };

    // Act
    const g = await GameService.createGame(gameData);

    // Assert
    expect(g.id).toBeDefined();
  });

  test("getAllGames filters by status", async () => {
    // Arrange
    await GameService.createGame({
      title: "G1",
      status: GAME_STATUS.INACTIVE,
      maxPlayers: 4,
      rules: "std",
      creatorId: creator.id,
    });
    await GameService.createGame({
      title: "G2",
      status: GAME_STATUS.FINISHED,
      maxPlayers: 4,
      rules: "std",
      creatorId: creator.id,
    });

    // Act
    const inactive = await GameService.getAllGames({
      status: GAME_STATUS.INACTIVE,
    });

    // Assert
    expect(inactive.length).toBe(1);
  });

  test("getGameById returns null if not found", async () => {
    // Arrange
    const invalidId = 9999;

    // Act
    const g = await GameService.getGameById(invalidId);

    // Assert
    expect(g).toBeNull();
  });

  test("updateGame updates game", async () => {
    // Arrange
    const g = await GameService.createGame({
      title: "G1",
      status: GAME_STATUS.INACTIVE,
      maxPlayers: 4,
      rules: "std",
      creatorId: creator.id,
    });
    const updateData = { title: "G1-upd" };

    // Act
    const updated = await GameService.updateGame(g.id, updateData);

    // Assert
    expect(updated.title).toBe("G1-upd");
  });

  test("updateGame returns null if not found", async () => {
    // Arrange
    const invalidId = 9999;
    const updateData = { title: "X" };

    // Act
    const updated = await GameService.updateGame(invalidId, updateData);

    // Assert
    expect(updated).toBeNull();
  });

  test("deleteGame returns true if deleted", async () => {
    // Arrange
    const g = await GameService.createGame({
      title: "G1",
      status: GAME_STATUS.INACTIVE,
      maxPlayers: 4,
      rules: "std",
      creatorId: creator.id,
    });

    // Act
    const res = await GameService.deleteGame(g.id);

    // Assert
    expect(res).toBe(true);
  });

  test("deleteGame returns false if not found", async () => {
    // Arrange
    const invalidId = 9999;

    // Act
    const res = await GameService.deleteGame(invalidId);

    // Assert
    expect(res).toBe(false);
  });
});
