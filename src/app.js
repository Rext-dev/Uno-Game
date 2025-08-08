import express from "express";
import { createServer } from "http";
import { connectDB, sequelize } from "./config/database-config.js";
import errorHandler from "./middlewares/error-handler.js";
import playerRoutes from "./routes/player-route.js";
import cardRoutes from "./routes/card-route.js";
import scoreRoutes from "./routes/score-route.js";
import unoGameRoutes from "./routes/uno-game-route.js";
import authRoutes from "./routes/auth-route.js";

const app = express();
const server = createServer(app);

// Middleware globales
app.use(express.json());

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/players", playerRoutes);
app.use("/api/cards", cardRoutes);
app.use("/api/scores", scoreRoutes);
app.use("/api/games", unoGameRoutes);

// Error handler
app.use(errorHandler);

async function startServer() {
  try {
    await connectDB();
    await sequelize.sync({ force: false }); // True para reiniciar y aplicar los cambios a la bd, solo lo habilito mientras lo desarrollo y haga cambios en los modelos.
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
}

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

startServer();
