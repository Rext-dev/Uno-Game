import { describe, expect, test, beforeAll, beforeEach } from "@jest/globals";
import { sequelize } from "../../src/config/database-config.js";
import Player from "../../src/models/player-model.js";
import * as PlayerService from "../../src/services/player-service.js";

describe("Player Service", () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  beforeEach(async () => {
    await Player.destroy({ where: {} });
  });

  test("createPlayer should create a player", async () => {
    // Arrange
    const data = {
      name: "Pedro",
      age: 25,
      email: "pedro@pedritoCorreos.com",
      password: "12345678",
    };

    // Act
    const player = await PlayerService.createPlayer(data);

    // Assert
    expect(player.id).toBeDefined();
    expect(player.name).toBe("Pedro");
  });

  test("getAllPlayers excludes password", async () => {
    // Arrange
    await PlayerService.createPlayer({
      name: "Pablo",
      age: 30,
      email: "pablo@PablosCorreo.com",
      password: "secret123",
    });

    // Act
    const players = await PlayerService.getAllPlayers();

    // Assert
    expect(players.length).toBe(1);
    expect(players[0].dataValues.password).toBeUndefined();
  });

  test("getPlayerById returns null if not found", async () => {
    // Arrange
    const invalidId = 9999;

    // Act
    const result = await PlayerService.getPlayerById(invalidId);

    // Assert
    expect(result).toBeNull();
  });

  test("updatePlayer updates existing fields", async () => {
    // Arrange
    const p = await PlayerService.createPlayer({
      name: "Aguilar",
      age: 22,
      email: "Aguilar@jala.university",
      password: "secret123",
    });
    const updateData = { name: "Aguilar Updated" };

    // Act
    const updated = await PlayerService.updatePlayer(p.id, updateData);

    // Assert
    expect(updated.name).toBe("Aguilar Updated");
  });

  test("updatePlayer returns null if not found", async () => {
    // Arrange
    const invalidId = 123456;
    const updateData = { name: "X" };

    // Act
    const updated = await PlayerService.updatePlayer(invalidId, updateData);

    // Assert
    expect(updated).toBeNull();
  });

  test("deletePlayer deletes and returns true", async () => {
    // Arrange
    const p = await PlayerService.createPlayer({
      name: "Dana",
      age: 28,
      email: "dana@jala.university",
      password: "secret123",
    });

    // Act
    const deleted = await PlayerService.deletePlayer(p.id);

    // Assert
    expect(deleted).toBe(true);
  });

  test("deletePlayer returns false if not found", async () => {
    // Arrange
    const invalidId = 555555;

    // Act
    const deleted = await PlayerService.deletePlayer(invalidId);

    // Assert
    expect(deleted).toBe(false);
  });
});
