import { describe, test, expect } from "@jest/globals";
import errorHandler from "../../src/middlewares/error-handler.js";

const callMw = (err) =>
  new Promise((resolve) => {
    const req = {};
    const res = {
      status: (c) => ({ json: (o) => resolve({ code: c, body: o }) }),
    };
    errorHandler(err, req, res, () => {});
  });

describe("error-handler middleware", () => {
  test("maneja 404 con status 404", async () => {
    const out = await callMw({ status: 404, message: "Not found x" });
    expect(out.code).toBe(404);
  });
  test("fallback 500 para error genérico", async () => {
    const out = await callMw(new Error("boom"));
    expect(out.code).toBe(500);
  });
});
