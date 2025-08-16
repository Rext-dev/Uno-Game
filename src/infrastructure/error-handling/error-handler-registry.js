export class ErrorHandlerRegistry {
  constructor() {
    this.handlers = new Map();
  }
  register(errorName, handlerFn) {
    this.handlers.set(errorName, handlerFn);
  }
  handle(err, req, res, next) {
    const handler = this.handlers.get(err.name);
    if (handler) {
      handler(err, req, res, next);
      return true;
    }
    return false;
  }
}

export const errorHandlerRegistry = new ErrorHandlerRegistry();

errorHandlerRegistry.register("ValidationError", (err, req, res, next) => {
  return res
    .status(400)
    .json({ error: err.message, details: err.details || [] });
});

errorHandlerRegistry.register(
  "SequelizeValidationError",
  (err, req, res, next) => {
    return res
      .status(422)
      .json({
        error: "Validation failed",
        details: err.errors?.map((e) => e.message) || [],
      });
  }
);

export default errorHandlerRegistry;
