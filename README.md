# UNO Backend Game

## Arquitectura del Sistema

### Arquitectura de Tres Capas

El proyecto sigue el patrón arquitectónico de tres capas:

```
┌─────────────────────────────────────┐
│        CAPA DE PRESENTACIÓN         │
│     (Routes + Controllers)          │
│  • Manejo de HTTP requests/responses │
│  • Validación con Joi schemas       │
│  • Autenticación JWT                │
│  • Serialización de datos           │
└─────────────────────────────────────┘
                    │
┌─────────────────────────────────────┐
│       CAPA DE LÓGICA DE NEGOCIO     │
│            (Services)               │
│  • Reglas de negocio UNO            │
│  • Validaciones de dominio          │
│  • Orquestación de operaciones      │
│  • Gestión de estados de juego      │
└─────────────────────────────────────┘
                    │
┌─────────────────────────────────────┐
│      CAPA DE ACCESO A DATOS         │
│         (Models + Config)           │
│  • Interacción con MySQL            │
│  • Definición de esquemas Sequelize │
│  • Relaciones entre entidades       │
└─────────────────────────────────────┘
```

### Estructura de Directorios

```
src/
├── app.js                     # Punto de entrada de la aplicación
├── config/
│   ├── database-config.js     # Configuración de base de datos MySQL
│   ├── game-constants.js      # Constantes del juego UNO
│   └── jwt-config.js          # Configuración JWT para autenticación
├── controllers/               # Capa de Presentación
│   ├── auth-controller.js     # Login, logout, user data
│   ├── card-controller.js     # Gestión de cartas
│   ├── game-controller.js     # Gestión básica de juegos || migrando a uno-game-controller.js
│   ├── player-controller.js   # CRUD de jugadores
│   ├── score-controller.js    # Gestión de puntuaciones
│   └── uno-game-controller.js # Lógica específica de partidas UNO
├── middlewares/               # Middleware de aplicación
│   ├── auth-middleware.js     # Validación JWT
│   ├── error-handler.js       # Manejo centralizado de errores
│   ├── game-validator.js      # Validaciones de juego
│   └── validation-middleware.js # Validación con Joi schemas
├── models/                    # Capa de Acceso a Datos
│   ├── card-model.js          # Modelo de cartas UNO
│   ├── game-cards-model.js    # Relación juego-cartas
│   ├── game-players-model.js  # Relación juego-jugadores
│   ├── game-state-model.js    # Estado de partida UNO
│   ├── games-model.js         # Modelo de juegos
│   ├── player-model.js        # Modelo de jugadores (con auth)
│   └── score-model.js         # Modelo de puntuaciones
├── routes/                    # Definición de rutas
│   ├── auth-route.js          # Rutas de autenticación
│   ├── card-route.js          # Rutas de cartas
│   ├── player-route.js        # Rutas de jugadores
│   ├── score-route.js         # Rutas de puntuaciones
│   └── uno-game-route.js      # Rutas de partidas UNO
├── schemas/                   # Validaciones Joi
│   ├── auth-schema.js         # Esquemas de autenticación
│   ├── game-schema.js         # Esquemas de juegos
│   └── player-schemas.js      # Esquemas de jugadores
├── services/                  # Capa de Lógica de Negocio
│   ├── auth-service.js        # Lógica de autenticación
│   ├── card-service.js        # Lógica de cartas
│   ├── game-service.js        # Lógica básica de juegos
│   ├── player-service.js      # Lógica de jugadores
│   ├── score-service.js       # Lógica de puntuaciones
│   └── uno-game-service.js    # Lógica específica UNO
├── tests/                     # Pruebas (pendiente implementar)
└── utils/                     # Utilidades (pendiente implementar)
```

## Modelo de Base de Datos

### Entidades Principales

#### Games (Juegos)
```sql
CREATE TABLE Games (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    status ENUM('inactive', 'active', 'finished') NOT NULL,
    maxPlayers INTEGER NOT NULL DEFAULT 4,
    rules TEXT NOT NULL,
    createdAt TIMESTAMP DEFAULT NOW(),
    updatedAt TIMESTAMP DEFAULT NOW()
);
```

#### Players (Jugadores)
```sql
CREATE TABLE Players (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age INTEGER NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL, -- Hash con bcrypt
    createdAt TIMESTAMP DEFAULT NOW(),
    updatedAt TIMESTAMP DEFAULT NOW()
);
```

#### GamePlayers (Relación Juego-Jugadores)
```sql
CREATE TABLE GamePlayers (
    id SERIAL PRIMARY KEY,
    gameId INTEGER REFERENCES Games(id),
    playerId INTEGER REFERENCES Players(id),
    status ENUM('waiting', 'playing', 'left', 'finished') DEFAULT 'waiting',
    position INTEGER NOT NULL,
    score INTEGER DEFAULT 0,
    createdAt TIMESTAMP DEFAULT NOW(),
    updatedAt TIMESTAMP DEFAULT NOW()
);
```

#### GameState (Estado del Juego)
```sql
CREATE TABLE GameState (
    id SERIAL PRIMARY KEY,
    gameId INTEGER UNIQUE REFERENCES Games(id),
    currentPlayerPosition INTEGER NOT NULL DEFAULT 0,
    direction ENUM('clockwise', 'counterclockwise') DEFAULT 'clockwise',
    topDiscardCard JSON,
    currentColor VARCHAR(10),
    drawStack INTEGER DEFAULT 0,
    lastAction JSON,
    createdAt TIMESTAMP DEFAULT NOW(),
    updatedAt TIMESTAMP DEFAULT NOW()
);
```

#### Cards (Cartas)
```sql
CREATE TABLE Cards (
    id SERIAL PRIMARY KEY,
    color ENUM('red', 'blue', 'green', 'yellow', 'black') NOT NULL,
    value VARCHAR(20) NOT NULL, -- '0'-'9', 'Skip', 'Reverse', 'Draw Two', 'Wild', 'Wild Draw Four'
    gameId INTEGER REFERENCES Games(id),
    ownerId INTEGER REFERENCES Players(id),
    status ENUM('deck', 'hand', 'discard') DEFAULT 'deck',
    createdAt TIMESTAMP DEFAULT NOW(),
    updatedAt TIMESTAMP DEFAULT NOW()
);
```

#### GameCards (Relación Juego-Cartas detallada)
```sql
CREATE TABLE GameCards (
    id SERIAL PRIMARY KEY,
    gameId INTEGER REFERENCES Games(id),
    cardId INTEGER REFERENCES Cards(id),
    playerId INTEGER REFERENCES Players(id),
    location ENUM('deck', 'hand', 'discard') NOT NULL,
    position INTEGER,
    playedAt TIMESTAMP,
    createdAt TIMESTAMP DEFAULT NOW(),
    updatedAt TIMESTAMP DEFAULT NOW()
);
```

#### Scores (Puntuaciones)
```sql
CREATE TABLE Scores (
    id SERIAL PRIMARY KEY,
    score INTEGER NOT NULL DEFAULT 0,
    position INTEGER,
    playerId INTEGER REFERENCES Players(id),
    gameId INTEGER REFERENCES Games(id),
    createdAt TIMESTAMP DEFAULT NOW(),
    updatedAt TIMESTAMP DEFAULT NOW()
);
```

### Relaciones del Modelo

```
Games (1) ←→ (N) GamePlayers ←→ (N) Players
Games (1) ←→ (1) GameState
Games (1) ←→ (N) Cards
Games (1) ←→ (N) GameCards
Games (1) ←→ (N) Scores
Players (1) ←→ (N) Cards (ownerId)
Players (1) ←→ (N) Scores
Cards (1) ←→ (N) GameCards
```

## API REST Endpoints

### Authentication API

| Método | Endpoint | Autenticación | Descripción |
|--------|----------|---------------|-------------|
| `POST` | `/api/auth/login` | No | Login de usuario |
| `GET` | `/api/auth/user` | JWT | Obtener datos del usuario autenticado |
| `POST` | `/api/auth/logout` | JWT | Logout del usuario |

### Players API

| Método | Endpoint | Autenticación | Descripción |
|--------|----------|---------------|-------------|
| `GET` | `/api/players` | No | Obtener todos los jugadores |
| `GET` | `/api/players/:id` | No | Obtener jugador por ID |
| `POST` | `/api/players` | No | Registrar nuevo jugador |
| `PUT` | `/api/players/:id` | No | Actualizar jugador completo |
| `DELETE` | `/api/players/:id` | No | Eliminar jugador |

### Cards API

| Método | Endpoint | Autenticación | Descripción |
|--------|----------|---------------|-------------|
| `GET` | `/api/cards` | No | Obtener todas las cartas |
| `GET` | `/api/cards/:id` | No | Obtener carta por ID |
| `POST` | `/api/cards` | No | Crear nueva carta |
| `PUT` | `/api/cards/:id` | No | Actualizar carta |
| `PATCH` | `/api/cards/:id` | No | Actualización parcial |
| `DELETE` | `/api/cards/:id` | No | Eliminar carta |

### Scores API

| Método | Endpoint | Autenticación | Descripción |
|--------|----------|---------------|-------------|
| `GET` | `/api/scores` | No | Obtener todas las puntuaciones |
| `GET` | `/api/scores/:id` | No | Obtener puntuación por ID |
| `POST` | `/api/scores` | No | Registrar nueva puntuación |
| `PUT` | `/api/scores/:id` | No | Actualizar puntuación |
| `PATCH` | `/api/scores/:id` | No | Actualización parcial |
| `DELETE` | `/api/scores/:id` | No | Eliminar puntuación |

### UNO Games API (Partidas)

| Método | Endpoint | Autenticación | Descripción |
|--------|----------|---------------|-------------|
| `POST` | `/api/games` | JWT | Crear nueva partida UNO |
| `POST` | `/api/games/:id/join` | JWT | Unirse a partida |
| `POST` | `/api/games/:id/leave` | JWT | Abandonar partida |
| `POST` | `/api/games/:id/start` | JWT | Iniciar partida |
| `POST` | `/api/games/:id/finish` | JWT | Finalizar partida |
| `GET` | `/api/games/:id/status` | No | Estado de partida |
| `GET` | `/api/games/:id/players` | No | Jugadores de la partida |
| `GET` | `/api/games/:id/current-player` | No | Jugador actual en turno |
| `GET` | `/api/games/:id/top-card` | No | Carta superior del descarte |
| `GET` | `/api/games/:id/scores` | No | Puntuaciones de la partida |

## Funcionalidades Implementadas

### Sistema de Autenticación
- **JWT Authentication**: Login/logout con tokens JWT
- **Password Hashing**: Encriptación con bcrypt
- **Protected Routes**: Rutas protegidas con middleware de autenticación
- **User Management**: Gestión de datos de usuario autenticado

### Validaciones con Joi Schemas
- **Request Validation**: Validación de body, params y query parameters
- **Data Sanitization**: Limpieza automática de datos de entrada
- **Error Standardization**: Respuestas de error estandarizadas

### Gestión de Partidas UNO
- **Game Creation**: Crear partidas con configuración personalizada
- **Player Management**: Unirse/abandonar partidas
- **Game States**: Gestión de estados (inactive, active, finished)
- **Turn Management**: Control de turnos y dirección del juego
- **Game Rules**: Implementación de constantes y reglas UNO

### Gestión de Cartas
- **Card Model**: Modelo completo de cartas UNO (108 cartas)
- **Card Distribution**: Sistema de distribución de cartas por ubicación
- **Game Cards Tracking**: Seguimiento detallado de cartas por partida

### Sistema de Puntuaciones
- **Score Tracking**: Seguimiento de puntuaciones por jugador/partida
- **Game Results**: Gestión de resultados de partidas

## Tecnologías Utilizadas

- **Node.js** + **Express.js**: Backend framework
- **MySQL** + **Sequelize ORM**: Base de datos y mapeo objeto-relacional
- **JWT (jsonwebtoken)**: Autenticación y autorización
- **bcrypt**: Hash de contraseñas
- **Joi**: Validación de esquemas
- **dotenv**: Gestión de variables de entorno

## Lógica de Negocio UNO

### Estados de Juego
- **INACTIVE**: Partida creada, esperando jugadores
- **ACTIVE**: Partida en curso
- **FINISHED**: Partida terminada

### Estados de Jugador
- **WAITING**: Esperando que inicie la partida
- **PLAYING**: Participando activamente
- **LEFT**: Abandonó la partida
- **FINISHED**: Completó la partida

### Constantes del Juego
- **Colores**: Red, Blue, Green, Yellow, Wild
- **Tipos de Carta**: Number, Skip, Reverse, Draw Two, Wild, Wild Draw Four
- **Reglas**: Min/Max jugadores (2-10), cartas iniciales (7)
- **Direcciones**: Clockwise, Counterclockwise

### Características Pendientes de Implementar
- **Algoritmo de Barajado**: Distribución aleatoria de cartas
- **Lógica de Juego**: Validación de jugadas, efectos de cartas especiales
- **Sistema de Turnos**: Implementación completa del flujo de turnos
- **Pruebas**: Test unitarios e integración
- **Utilidades**: Helpers y funciones auxiliares


## POSTMAN

- [Colección Postman](https://enriquehernandez.postman.co/workspace/Enrique-Hernandez's-Workspace~28251f50-1fe2-4b27-8fff-dc0320d8cca3/folder/44698152-16be39e7-28dc-4d74-90b2-83150b426fde?action=share&creator=44698152&ctx=documentation)

La colección incluye:
- Endpoints de autenticación (login/logout)
- CRUD completo de jugadores
- Gestión de partidas UNO
- Endpoints de cartas y puntuaciones
- Variables de entorno configuradas
- Ejemplos de requests/responses