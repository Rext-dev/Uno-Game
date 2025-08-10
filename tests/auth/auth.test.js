import { describe, test, expect, beforeAll, beforeEach } from "@jest/globals";
import request from "supertest";
import express from "express";
import { TestDataFactory } from "../utils/test-helpers.js";
import authRoutes from "../../src/routes/auth-route.js";
import Player from "../../src/models/player-model.js";
import { sequelize } from "../../src/config/database-config.js";
import * as AuthService from "../../src/services/auth-service.js";
import { generateToken } from "../../src/config/jwt-config.js";

const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);

describe("Auth Controller Tests", () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  beforeEach(async () => {
    await Player.destroy({ where: {} });
  });

  describe("POST /api/auth/login", () => {
    test("successful login with valid credentials", async () => {
      // Arrange
      const playerData = TestDataFactory.createPlayer({
        email: "enrique@jalau.university",
        password: "12345678",
      });
      await Player.create(playerData);

      // Act
      const response = await request(app)
        .post("/api/auth/login")
        .send({ email: playerData.email, password: playerData.password });

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("token");
      expect(response.body.user.email).toBe(playerData.email);
    });

    test("fails with nonexistent email", async () => {
      // Arrange
      const email = "notfound@email.com";
      const password = "password123";

      // Act
      const response = await request(app)
        .post("/api/auth/login")
        .send({ email, password });

      // Assert
      expect(response.status).toBe(401);
    });

    test("fails with invalid password", async () => {
      // Arrange
      const playerData = TestDataFactory.createPlayer();
      await Player.create(playerData);
      const wrongPassword = "wrongpassword";

      // Act
      const response = await request(app)
        .post("/api/auth/login")
        .send({ email: playerData.email, password: wrongPassword });

      // Assert
      expect(response.status).toBe(401);
    });

    test("fails with missing credentials", async () => {
      // Arrange
      // Act
      const response = await request(app).post("/api/auth/login").send({});

      // Assert
      expect(response.status).toBe(400);
    });
  });

  describe("GET /api/auth/user", () => {
    test("gets profile with valid token", async () => {
      // Arrange
      const playerData = TestDataFactory.createPlayer();
      const player = await Player.create(playerData);
      const token = generateToken({
        id: player.id,
        email: player.email,
        name: player.name,
      });

      // Act
      const response = await request(app)
        .get("/api/auth/user")
        .send({ access_token: token });

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.user.id).toBe(player.id);
    });

    test("fails if user does not exist", async () => {
      // Arrange
      const token = generateToken({
        id: 99999,
        email: "ghost@example.com",
        name: "Ghost",
      });

      // Act
      const response = await request(app)
        .get("/api/auth/user")
        .send({ access_token: token });

      // Assert
      expect(response.status).toBe(404);
    });
  });

  describe("POST /api/auth/logout", () => {
    test("successful logout", async () => {
      // Arrange
      const playerData = TestDataFactory.createPlayer();
      const player = await Player.create(playerData);
      const token = generateToken({
        id: player.id,
        email: player.email,
        name: player.name,
      });

      // Act
      const response = await request(app)
        .post("/api/auth/logout")
        .send({ access_token: token });

      // Assert
      expect(response.status).toBe(200);
    });
  });
});

describe("Auth Service Tests", () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  beforeEach(async () => {
    await Player.destroy({ where: {} });
  });

  describe("loginUser", () => {
    test("successful login with valid credentials", async () => {
      // Arrange
      const playerData = TestDataFactory.createPlayer({
        email: "enrique@jala.university",
        password: "12345678",
      });
      await Player.create(playerData);

      // Act
      const result = await AuthService.loginUser(
        playerData.email,
        playerData.password
      );

      // Assert
      expect(result.user.email).toBe(playerData.email);
      expect(result).toHaveProperty("token");
    });

    test("throws error with invalid credentials", async () => {
      // Arrange
      const email = "Falso@jala.university";
      const password = "wrongpassword";

      // Act // assert¿?
      await expect(
        AuthService.loginUser(email, password)
      ).rejects.toThrow("Invalid credentials");
    });
  });

  describe("getUserById", () => {
    test("gets user by valid ID", async () => {
      // Arrange
      const playerData = TestDataFactory.createPlayer({
        email: "enrique@jala.university",
        password: "12345678",
      });
      const player = await Player.create(playerData);

      // Act
      const result = await AuthService.getUserById(player.id);

      // Assert
      expect(result.id).toBe(player.id);
    });

    test("throws error if user does not exist", async () => {
      // Arrange
      const invalidId = 99999;

      // Assert
      await expect(AuthService.getUserById(invalidId)).rejects.toThrow(
        "User not found"
      );
    });
  });
});
