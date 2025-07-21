const errorHandler = (err, req, res, next) => {
  if (err.status === 404) {
    return res.status(404).json({ error: err.message || "Resource not found" });
  }

  console.error("Internal Server Error:", err);
  return res.status(500).json({ error: "Internal Server Error" });
}

export default errorHandler;