import { describe, test, expect } from "@jest/globals";
import { HTTP_STATUS } from "../../src/constants/http-status-codes.js";

describe("HTTP_STATUS constants", () => {
  test("contiene códigos clave", () => {
    expect(HTTP_STATUS.OK).toBe(200);
    expect(HTTP_STATUS.CREATED).toBe(201);
    expect(HTTP_STATUS.NOT_FOUND).toBe(404);
    expect(HTTP_STATUS.INTERNAL_SERVER_ERROR).toBe(500);
  });
});
