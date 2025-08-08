// TODO: implementar logging estructurado con winston o similar
// TODO: agregar diferentes tipos de errores (ValidationError, AuthError, etc.)
// TODO: implementar rate limiting para errores repetidos
// TODO: agregar sanitización de errores en producción

/**
 * Central error handling middleware
 * TODO: expandir manejo de errores específicos de la aplicación
 */
const errorHandler = (err, req, res, next) => {
  // TODO: implementar logging con timestamp, user ID, request ID
  // TODO: agregar manejo de errores de validación de Sequelize
  // TODO: implementar manejo de errores de JWT
  // TODO: agregar manejo de errores de rate limiting
  console.error("Error occurred:", err);

  if (err.status === 404) {
    return res.status(404).json({ error: err.message || "Resource not found" });
  }

  // TODO: agregar manejo específico para:
  // - SequelizeValidationError
  // - SequelizeUniqueConstraintError
  // - JsonWebTokenError
  // - RateLimitError
  // - DatabaseConnectionError

  console.error("Internal Server Error:", err);
  
  // TODO: en producción, no exponer detalles del error
  // TODO: implementar IDs de error únicos para tracking
  return res.status(500).json({ 
    error: "Internal Server Error",
    // TODO: agregar errorId para tracking en logs
  });
};

// TODO: crear middleware específicos para:
// - notFoundHandler (404 para rutas no encontradas)
// - validationErrorHandler (errores de validación)
// - authErrorHandler (errores de autenticación/autorización)
// - databaseErrorHandler (errores de base de datos)

export default errorHandler;