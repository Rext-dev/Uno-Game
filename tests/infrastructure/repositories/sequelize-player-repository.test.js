import { describe, test, expect, beforeAll, beforeEach } from "@jest/globals";
import { sequelize } from "../../../src/config/database-config.js";
import Player from "../../../src/models/player-model.js";
import { SequelizePlayerRepository } from "../../../src/infrastructure/repositories/sequelize-player-repository.js";

const repo = new SequelizePlayerRepository();

describe("SequelizePlayerRepository", () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });
  beforeEach(async () => {
    await Player.destroy({ where: {} });
  });

  test("create y findById funcionan", async () => {
    const created = await repo.create({
      name: "Test",
      age: 20,
      email: "a@b.com",
      password: "12345678",
    });
    const found = await repo.findById(created.id);
    expect(found.id).toBe(created.id);
  });

  test("update retorna entidad actualizada", async () => {
    const created = await repo.create({
      name: "Upd",
      age: 22,
      email: "u@u.com",
      password: "12345678",
    });
    const updated = await repo.update(created.id, { age: 30 });
    expect(updated.age).toBe(30);
  });

  test("delete retorna true y luego false", async () => {
    const created = await repo.create({
      name: "Del",
      age: 25,
      email: "d@d.com",
      password: "12345678",
    });
    const first = await repo.delete(created.id);
    const second = await repo.delete(created.id);
    expect(first).toBe(true);
    expect(second).toBe(false);
  });
});
