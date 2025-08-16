import Player from "../../models/player-model.js";
import { IPlayerRepository } from "../../domain/repositories/player-repository-interface.js";

export class SequelizePlayerRepository extends IPlayerRepository {
  async create(playerData) {
    return Player.create(playerData);
  }
  async findAll(options = {}) {
    options = { ...options };
    if (!options.attributes) options.attributes = { exclude: ["password"] };
    return Player.findAll(options);
  }
  async findById(id) {
    return Player.findByPk(id);
  }
  async update(id, data) {
    const player = await Player.findByPk(id);
    if (!player) return null;
    await player.update(data);
    return player;
  }
  async delete(id) {
    const player = await Player.findByPk(id);
    if (!player) return false;
    await player.destroy();
    return true;
  }
}

export default SequelizePlayerRepository;
