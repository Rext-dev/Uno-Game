# MR: Backend UNO — CRUD, Arquitectura, Pruebas y Cobertura

## CAMBIOS

- Config de pruebas: Jest con setup global, BD en memoria, ejecución de un solo worker.

### Operaciones CRUD

- Implementación completa de CRUD para Players, Cards, Scores, Games.
- Pruebas de servicios y controladores que cubren crear, listar, obtener por id, actualizar, eliminar, todo esto incluyendo manejo de errores

### Arquitectura

- Mantengo una separacion de capas de la siguiente manera:
  `routes/` → `controllers/` → `services/` → `models/` (+ `middlewares/`, `schemas/`).

### Base de Datos

- Sequelize configurado con MySQL para uso normal y `sqlite::memory:` para pruebas.
- `tests/setup.js` sincroniza el esquema al inicio y asegura limpieza entre pruebas.
-

### Unit test

- 81 pruebas pasando que abarcan servicios, controladores y middlewares.
- Casos donde funciona de manera correcta y con errores, límites y de lógica.

### Code Coverage

- Cobertura global (última ejecución):
  - Statements: 70.22%
  - Lines: 70.39%
  - Functions: 78.65%
  - Branches: 69.50%
- Los umbrales los configure en `jest.config.js`: 70% líneas/funciones/estatements y 50% ramas.
