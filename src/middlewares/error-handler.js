// TODO: implementar logging estructurado con winston o similar
// TODO: agregar diferentes tipos de errores (ValidationError, AuthError, etc.)
// TODO: implementar rate limiting para errores repetidos
// TODO: agregar sanitización de errores en producción
import { errorHandlerRegistry } from "../infrastructure/error-handling/error-handler-registry.js";

/**
 * Central error handling middleware
 * TODO: expandir manejo de errores específicos de la aplicación
 */
const errorHandler = (err, req, res, next) => {
  console.error("Error occurred:", err);

  const handled = errorHandlerRegistry.handle(err, req, res, next);
  if (handled) return;

  if (err.status === 404) {
    return res.status(404).json({ error: err.message || "Resource not found" });
  }

  console.error("Internal Server Error:", err);
  return res.status(500).json({ error: "Internal Server Error" });
};

// TODO: crear middleware específicos para:
// - notFoundHandler (404 para rutas no encontradas)
// - validationErrorHandler (errores de validación)
// - authErrorHandler (errores de autenticación/autorización)
// - databaseErrorHandler (errores de base de datos)

export default errorHandler;
