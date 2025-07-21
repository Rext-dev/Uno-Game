import express from "express";
import { createServer } from "http";
import { connectDB, sequelize } from "./config/database-config.js";
import errorHandler from "./middleware/error-handler.js";
import gameRoutes from "./routes/game-route.js";

const app = express();
const server = createServer(app);

// Middleware globales
app.use(express.json());
// Error handler
app.use(errorHandler);

//ROUTES
app.use("/api/game", gameRoutes);

async function startServer() {
  try {
    await connectDB();
    await sequelize.sync({ force: true }); // True para reiniciar y aplicar los cambios a la bd, solo lo habilito mientras lo desarrollo y haga cambios en los modelos.
    server.listen(3000, () => {
      console.log("Server listening on port 3000");
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
}

startServer();
