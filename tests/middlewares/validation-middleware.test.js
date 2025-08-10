import { describe, test, expect } from "@jest/globals";
import express from "express";
import request from "supertest";
import Joi from "joi";
import {
  validateBody,
  validateParams,
} from "../../src/middlewares/validation-middleware.js";

const bodySchema = Joi.object({ name: Joi.string().min(2).required() });
const paramsSchema = Joi.object({ id: Joi.number().integer().required() });

describe("validation-middleware", () => {
  test("validateBody returns 400 when body is empty", async () => {
    // Arrange
    const app = express();
    app.use(express.json());
    app.post("/test", validateBody(bodySchema), (req, res) =>
      res.json({ ok: true })
    );
    const body = {};

    // Act
    const res = await request(app).post("/test").send(body);

    // Assert
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test("validateBody passes and cleans body", async () => {
    // Arrange
    const app = express();
    app.use(express.json());
    app.post("/test", validateBody(bodySchema), (req, res) =>
      res.json(req.body)
    );
    const body = { name: "Joe", extra: "x" };

    // Act
    const res = await request(app).post("/test").send(body);

    // Assert
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ name: "Joe" });
  });

  test("validateParams returns 400 if param is invalid", async () => {
    // Arrange
    const app = express();
    app.get("/item/:id", validateParams(paramsSchema), (req, res) =>
      res.json({ id: req.params.id })
    );
    const invalidParam = "notanumber";

    // Act
    const res = await request(app).get(`/item/${invalidParam}`);

    // Assert
    expect(res.status).toBe(400);
  });

  test("validateParams passes with number", async () => {
    // Arrange
    const app = express();
    app.get("/item/:id", validateParams(paramsSchema), (req, res) =>
      res.json({ id: req.params.id })
    );
    const validParam = 123;

    // Act
    const res = await request(app).get(`/item/${validParam}`);

    // Assert
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(123);
  });
});
