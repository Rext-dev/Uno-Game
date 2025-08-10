import { describe, test, expect } from "@jest/globals";
import express from "express";
import request from "supertest";
import { validateJWT } from "../../src/middlewares/auth-middleware.js";
import { accessTokenSchema } from "../../src/schemas/auth-schema.js";
import { generateToken } from "../../src/config/jwt-config.js";

const buildApp = () => {
  const app = express();
  app.use(express.json());
  app.post("/secure", validateJWT(accessTokenSchema), (req, res) => {
    res.json({ user: req.user });
  });
  return app;
};

describe("auth-middleware validateJWT", () => {
  test("returns 400 if body is empty", async () => {
    // Arrange
    const app = buildApp();
    const body = {};

    // Act
    const res = await request(app).post("/secure").send(body);

    // Assert
    expect(res.status).toBe(400);
  });

  test("returns 400 if body does not contain access_token but has other fields", async () => {
    // Arrange
    const app = buildApp();
    const body = { other: "x" };

    // Act
    const res = await request(app).post("/secure").send(body);

    // Assert
    expect(res.status).toBe(400);
  });

  test("returns 401 if token is invalid", async () => {
    // Arrange
    const app = buildApp();
    const body = { access_token: "abc.invalid.token" };

    // Act
    const res = await request(app).post("/secure").send(body);

    // Assert
    expect(res.status).toBe(401);
  });

  test("passes and attaches user with valid token", async () => {
    // Arrange
    const app = buildApp();
    const token = generateToken({
      id: 1,
      email: "enrique@jalau.university",
      name: "User",
    });
    const body = { access_token: token };

    // Act
    const res = await request(app).post("/secure").send(body);

    // Assert
    expect(res.status).toBe(200);
    expect(res.body.user).toHaveProperty("id", 1);
  });
});
