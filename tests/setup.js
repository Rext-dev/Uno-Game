import { sequelize } from '../src/config/database-config.js';
import '../src/models/player-model.js';
import '../src/models/games-model.js';
import '../src/models/card-model.js';
import '../src/models/score-model.js';
import '../src/models/game-players-model.js';
import '../src/models/game-state-model.js';

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  if (sequelize?.close) {
    await sequelize.close();
  }
});
