import { describe, test, expect } from "@jest/globals";
import { ErrorHandlerRegistry } from "../../../src/infrastructure/error-handling/error-handler-registry.js";

describe("ErrorHandlerRegistry", () => {
  test("registra y maneja un error custom", () => {
    const registry = new ErrorHandlerRegistry();
    const calls = [];
    registry.register("MyError", (err, req, res) => {
      calls.push(err.message);
      res.status(418).json({ error: "teapot" });
    });

    const err = { name: "MyError", message: "boom" };
    const res = { status: (c) => ({ json: (o) => ({ code: c, body: o }) }) };

    const handled = registry.handle(err, {}, res, () => {});
    expect(handled).toBe(true);
    expect(calls).toEqual(["boom"]);
  });

  test("retorna false si no hay handler", () => {
    const registry = new ErrorHandlerRegistry();
    const handled = registry.handle({ name: "Unknown" }, {}, {}, () => {});
    expect(handled).toBe(false);
  });
});
