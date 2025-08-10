import { describe, test, expect, beforeEach } from "@jest/globals";
import * as UnoGameService from "../../src/services/uno-game-service.js";
import * as GameService from "../../src/services/game-service.js";
import GamePlayers from "../../src/models/game-players-model.js";
import GameState from "../../src/models/game-state-model.js";
import Games from "../../src/models/games-model.js";
import Player from "../../src/models/player-model.js";
import { GAME_STATUS, PLAYER_STATUS } from "../../src/config/game-constants.js";

let player1, player2;

describe("UNO Game Service", () => {
  beforeEach(async () => {
    await GameState.destroy({ where: {} });
    await GamePlayers.destroy({ where: {} });
    await Games.destroy({ where: {} });
    await Player.destroy({ where: {} });
    player1 = await Player.create({
      name: "P1",
      age: 20,
      email: "p1@example.com",
      password: "pass1234",
    });
    player2 = await Player.create({
      name: "P2",
      age: 21,
      email: "p2@example.com",
      password: "pass1234",
    });
  });

  test("createGame creates INACTIVE game with creator in WAITING", async () => {
    // Arrange
    const gameData = { title: "UNO 1", maxPlayers: 4, rules: "std" };

    // Act
    const res = await UnoGameService.createGame(gameData, player1.id);
    const status = await UnoGameService.getGameStatus(res.game_id);

    // Assert
    expect(res.game_id).toBeDefined();
    expect(status.game.status).toBe(GAME_STATUS.INACTIVE);
    expect(status.players.length).toBe(1);
    expect(status.players[0].status).toBe(PLAYER_STATUS.WAITING);
  });

  test("joinGame adds player and returns status", async () => {
    // Arrange
    const { game_id } = await UnoGameService.createGame(
      { title: "UNO 2", maxPlayers: 4, rules: "std" },
      player1.id
    );

    // Act
    const status = await UnoGameService.joinGame(game_id, player2.id);

    // Assert
    expect(status.players.length).toBe(2);
  });

  test("joinGame error if player duplicated", async () => {
    // Arrange
    const { game_id } = await UnoGameService.createGame(
      { title: "UNO 3", maxPlayers: 4, rules: "std" },
      player1.id
    );
    await UnoGameService.joinGame(game_id, player2.id);

    // Act & Assert
    await expect(UnoGameService.joinGame(game_id, player2.id)).rejects.toThrow(
      "Player already in game"
    );
  });

  test("joinGame error if game not found", async () => {
    // Arrange
    const invalidGameId = 9999;

    // Act & Assert
    await expect(
      UnoGameService.joinGame(invalidGameId, player2.id)
    ).rejects.toThrow("Game not found");
  });

  test("leaveGame removes player when INACTIVE", async () => {
    // Arrange
    const { game_id } = await UnoGameService.createGame(
      { title: "UNO 4", maxPlayers: 4, rules: "std" },
      player1.id
    );
    await UnoGameService.joinGame(game_id, player2.id);

    // Act
    const afterLeave = await UnoGameService.leaveGame(game_id, player2.id);

    // Assert
    expect(afterLeave.players.length).toBe(1);
  });

  test("startGame error for insufficient players", async () => {
    // Arrange
    const { game_id } = await UnoGameService.createGame(
      { title: "UNO 5", maxPlayers: 4, rules: "std" },
      player1.id
    );

    // Act & Assert
    await expect(UnoGameService.startGame(game_id, player1.id)).rejects.toThrow(
      "Need at least"
    );
  });

  test("startGame success with enough players", async () => {
    // Arrange
    const { game_id } = await UnoGameService.createGame(
      { title: "UNO 6", maxPlayers: 4, rules: "std" },
      player1.id
    );
    await UnoGameService.joinGame(game_id, player2.id);

    // Act
    const status = await UnoGameService.startGame(game_id, player1.id);

    // Assert
    expect(status.game.status).toBe(GAME_STATUS.ACTIVE);
  });

  test("finishGame changes status to FINISHED after start", async () => {
    // Arrange
    const { game_id } = await UnoGameService.createGame(
      { title: "UNO 7", maxPlayers: 4, rules: "std" },
      player1.id
    );
    await UnoGameService.joinGame(game_id, player2.id);
    await UnoGameService.startGame(game_id, player1.id);

    // Act
    const finished = await UnoGameService.finishGame(game_id);

    // Assert
    expect(finished.game.status).toBe(GAME_STATUS.FINISHED);
  });

  test("getGamePlayers returns array of players", async () => {
    // Arrange
    const { game_id } = await UnoGameService.createGame(
      { title: "UNO 7", maxPlayers: 4, rules: "std" },
      player1.id
    );
    await UnoGameService.joinGame(game_id, player2.id);

    // Act
    const players = await UnoGameService.getGamePlayers(game_id);

    // Assert
    expect(players.length).toBe(2);
  });

  test("getCurrentPlayer returns actual current player", async () => {
    // Arrange
    const { game_id } = await UnoGameService.createGame(
      { title: "UNO 8", maxPlayers: 4, rules: "std" },
      player1.id
    );
    await UnoGameService.joinGame(game_id, player2.id);
    await UnoGameService.startGame(game_id, player1.id);

    // Act
    const cp = await UnoGameService.getCurrentPlayer(game_id);

    // Assert
    expect(cp).toHaveProperty("id");
  });

  test("getCurrentPlayer error if game not active", async () => {
    // Arrange
    const { game_id } = await UnoGameService.createGame(
      { title: "UNO 9", maxPlayers: 4, rules: "std" },
      player1.id
    );

    // Act & Assert
    await expect(UnoGameService.getCurrentPlayer(game_id)).rejects.toThrow(
      "Game not active"
    );
  });

  test("getTopDiscardCard initially null", async () => {
    // Arrange
    const { game_id } = await UnoGameService.createGame(
      { title: "UNO 9", maxPlayers: 4, rules: "std" },
      player1.id
    );

    // Act
    const top = await UnoGameService.getTopDiscardCard(game_id);

    // Assert
    expect(top).toBeNull();
  });

  test("getGameScores returns scores", async () => {
    // Arrange
    const { game_id } = await UnoGameService.createGame(
      { title: "UNO 10", maxPlayers: 4, rules: "std" },
      player1.id
    );
    await UnoGameService.joinGame(game_id, player2.id);

    // Act
    const scores = await UnoGameService.getGameScores(game_id);

    // Assert
    expect(scores.length).toBe(2);
  });
});
