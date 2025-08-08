const validateGame = (req, res, next) => {
  const { name, description, genre, platform } = req.body;

  if (!name || !description || !genre || !platform) {
    return res.status(400).json({ error: "All fields are required" });
  }

  next();
}

export default validateGame;
