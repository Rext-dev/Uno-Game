import { Sequelize } from "sequelize";
import { config } from "dotenv";
config();

const sequelize = new Sequelize(
  process.env.DB_NAME || "default_db",
  process.env.DB_USER || "default_user",
  process.env.DB_PASSWORD || "default_password",
  {
    host: process.env.DB_HOST || "localhost",
    dialect: process.env.DB_DIALECT || "mysql",
    port: process.env.DB_PORT || 3306,
  }
);

async function connectDB() {
  try {
    // TODO: agregar timeout para la conexion
    await sequelize.authenticate();
    console.log("Conexión a la base de datos establecida correctamente.");
    // TODO: agregar validación de esquema de BD
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error);
    process.exit(1);
  }
}

export { sequelize, connectDB };
