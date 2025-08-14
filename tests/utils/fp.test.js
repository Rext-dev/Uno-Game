import { describe, test, expect } from "@jest/globals";
import Joi from "joi";
import {
  Either,
  validateWithJoi,
  eitherFromValidation,
} from "../../src/utils/fp.js";

describe("Either monad", () => {
  test("map applies function on Right and not on Left", () => {
    const r = Either.right(2).map((x) => x + 1);
    const l = Either.left("err").map((x) => x + 1);
    expect(r.isRight()).toBe(true);
    expect(r.value()).toBe(3);
    expect(l.isLeft()).toBe(true);
    expect(l.value()).toBe("err");
  });

  test("chain flattens and propagates Left", () => {
    const safeDiv = (a, b) =>
      b === 0 ? Either.left("/0") : Either.right(a / b);
    const res1 = Either.right(10)
      .chain((x) => safeDiv(x, 2))
      .chain((x) => safeDiv(x, 5));
    const res2 = Either.right(10)
      .chain((x) => safeDiv(x, 0))
      .chain((x) => safeDiv(x, 5));
    expect(res1.isRight()).toBe(true);
    expect(res1.value()).toBe(1);
    expect(res2.isLeft()).toBe(true);
  });

  test("fold extracts values correctly", () => {
    const msgR = Either.right(42).fold(
      (l) => `L:${l}`,
      (r) => `R:${r}`
    );
    const msgL = Either.left("err").fold(
      (l) => `L:${l}`,
      (r) => `R:${r}`
    );
    expect(msgR).toBe("R:42");
    expect(msgL).toBe("L:err");
  });
});

describe("eitherFromValidation / validateWithJoi", () => {
  const schema = Joi.object({ name: Joi.string().min(2).required() });

  test("validateWithJoi returns Right on valid data", () => {
    const res = validateWithJoi(
      schema,
      { name: "Joe" },
      { abortEarly: false, stripUnknown: true }
    );
    expect(res.isRight()).toBe(true);
    const val = res.value();
    expect(val).toEqual({ name: "Joe" });
  });

  test("validateWithJoi returns Left on invalid data", () => {
    const res = validateWithJoi(
      schema,
      { name: "J" },
      { abortEarly: false, stripUnknown: true }
    );
    expect(res.isLeft()).toBe(true);
    const errors = res.value();
    expect(Array.isArray(errors)).toBe(true);
    expect(errors[0].field).toBe("name");
  });

  test("eitherFromValidation maps details to friendly errors", () => {
    const fake = {
      error: {
        details: [{ path: ["name"], message: "bad", context: { value: 1 } }],
      },
      value: {},
    };
    const res = eitherFromValidation(fake);
    expect(res.isLeft()).toBe(true);
    const errors = res.value();
    expect(errors[0]).toEqual({ field: "name", message: "bad", value: 1 });
  });
});
