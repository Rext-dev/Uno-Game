import { describe, test, expect, beforeEach } from "@jest/globals";
import express from "express";
import request from "supertest";
import playerRoutes from "../../src/routes/player-route.js";
import Player from "../../src/models/player-model.js";

const app = express();
app.use(express.json());
app.use("/api/players", playerRoutes);

describe("Players Controller CRUD", () => {
  beforeEach(async () => {
    await Player.destroy({ where: {} });
  });

  test("POST /api/players creates player (201) and hides password", async () => {
    // Arrange
    const playerData = {
      name: "Juan",
      age: 25,
      email: "juan@correosjuanito.vip",
      password: "secret123",
    };

    // Act
    const res = await request(app).post("/api/players").send(playerData);

    // Assert
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body).not.toHaveProperty("password");
  });

  test("POST /api/players returns 409 if email is duplicated", async () => {
    // Arrange
    await Player.create({
      name: "Dup",
      age: 20,
      email: "correo@pedrito.com",
      password: "pass1234",
    });
    const duplicateData = {
      name: "Dup2",
      age: 22,
      email: "correo@pedrito.com",
      password: "pass1234",
    };

    // Act
    const res = await request(app).post("/api/players").send(duplicateData);

    // Assert
    expect(res.status).toBe(409);
  });

  test("GET /api/players returns list (200)", async () => {
    // Arrange
    await Player.create({
      name: "P1",
      age: 20,
      email: "p1@correosjuanito.vip",
      password: "pass1234",
    });

    // Act
    const res = await request(app).get("/api/players");

    // Assert
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).not.toHaveProperty("password");
  });

  test("GET /api/players/:id returns 404 if not found", async () => {
    // Arrange
    const invalidId = 9999;

    // Act
    const res = await request(app).get(`/api/players/${invalidId}`);

    // Assert
    expect(res.status).toBe(404);
  });

  test("GET /api/players/:id returns player without password", async () => {
    // Arrange
    const player = await Player.create({
      name: "Bob",
      age: 30,
      email: "bob@correosjuanito.vip",
      password: "pass1234",
    });

    // Act
    const res = await request(app).get(`/api/players/${player.id}`);

    // Assert
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(player.id);
    expect(res.body).not.toHaveProperty("password");
  });

  test("PUT /api/players/:id updates player (200)", async () => {
    // Arrange
    const player = await Player.create({
      name: "Ch",
      age: 18,
      email: "ch@correosjuanito.vip",
      password: "pass1234",
    });
    const updateData = { name: "Changed" };

    // Act
    const res = await request(app)
      .put(`/api/players/${player.id}`)
      .send(updateData);

    // Assert
    expect(res.status).toBe(200);
    expect(res.body.name).toBe("Changed");
  });

  test("PUT /api/players/:id returns 404 if not found", async () => {
    // Arrange
    const invalidId = 123456;
    const updateData = { name: "None" };

    // Act
    const res = await request(app)
      .put(`/api/players/${invalidId}`)
      .send(updateData);

    // Assert
    expect(res.status).toBe(404);
  });

  test("DELETE /api/players/:id deletes player (204)", async () => {
    // Arrange
    const player = await Player.create({
      name: "Del",
      age: 19,
      email: "del@jalau.university",
      password: "pass1234",
    });

    // Act
    const res = await request(app).delete(`/api/players/${player.id}`);

    // Assert
    expect(res.status).toBe(204);
  });

  test("DELETE /api/players/:id returns 404 if not found", async () => {
    // Arrange
    const invalidId = 987654;

    // Act
    const res = await request(app).delete(`/api/players/${invalidId}`);

    // Assert
    expect(res.status).toBe(404);
  });
});
