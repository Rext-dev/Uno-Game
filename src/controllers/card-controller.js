import * as CardService from "../services/card-service.js";

// TODO: evitar que al leer, editar o borrar una carta si el usuario no pertenece al juego de la carta...
/**
 * Create a new card
 * 
 * @async
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body data
 * @param {string} req.body.color - Card color
 * @param {string} req.body.value - Card value
 * @param {number} req.body.gameId - Game ID this card belong
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export const createCard = async (req, res) => {
  try {
    const { color, value, gameId } = req.body;
    
    // TODO: usar middleware de validación para color y value válidos del UNO
    // TODO: validar que gameId exista en la base de datos
    // TODO: validar que color o value sea válido 
    // TODO: prevenir creación manual de cartas en juegos ya iniciados
    const newCard = await CardService.createCard({
      color,
      value,
      gameId,
    });
    
    res.status(201).json(newCard);
  } catch (error) {
    res.status(500).json({ error: "Error creating card" });
  }
};

/**
 * Get all cards from a game
 * 
 * @async
 * @param {Object} req - Express request object
 * @param {string} req.query.gameId - Optional game ID to filter cards
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export const getAllCards = async (req, res) => {
  try {
    const { gameId } = req.query;
    // TODO: validar que gameId exista si se proporciona
    // TODO: implementar autorización (solo cartas del juego del usuario)
    const cards = await CardService.getAllCards(gameId);
    res.status(200).json(cards);
  } catch (error) {
    res.status(500).json({ error: "Error fetching cards" });
  }
};

/**
 * Get a card by ID.
 * @async
 * @param {Object} req - Express request object
 * @param {string} req.params.id - The ID of the card to get
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 * 
 */
export const getCardById = async (req, res) => {
  try {
    const { id } = req.params;
    const card = await CardService.getCardById(id);

    if (!card) {
      return res.status(404).json({ error: "Card not found" });
    }
    
    res.status(200).json(card);
  } catch (error) {
    res.status(500).json({ error: "Error fetching card" });
  }
};

/**
 * Update a card by ID
 * 
 * @async
 * @param {Object} req - Express request object
 * @param {string} req.params.id - The ID of the card to update
 * @param {Object} req.body - Request body data
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export const updateCard = async (req, res) => {
  try {
    const { id } = req.params;
    const cardData = req.body;

    const updatedCard = await CardService.updateCard(id, cardData);

    if (!updatedCard) {
      return res.status(404).json({ error: "Card not found" });
    }

    res.status(200).json(updatedCard);
  } catch (error) {
    res.status(500).json({ error: "Error updating card" });
  }
};

/**
 * Delete a card by ID
 * @async
 * @param {Object} req - Express request object
 * @param {string} req.params.id - The ID of the card to delete
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export const deleteCard = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await CardService.deleteCard(id);

    if (!deleted) {
      return res.status(404).json({ error: "Card not found" });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Error deleting card" });
  }
};

/**
 * Initialize a deck for a game.
 * 
 * @async
 * @function initializeDeck
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body data
 * @param {number} req.body.gameId - Game ID to create deck for
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export const initializeDeck = async (req, res) => {
  try {
    const { gameId } = req.body;
    
    // TODO: verificar que el gameId exista, enviar 404 si no existe
    // TODO: verificar que no tenga ya un mazo creado, enviar 409 si ya existe
    // TODO: implementar autorización
    
    const deck = await CardService.initializeDeck(gameId);
    res.status(201).json({
      message: "Deck initialized successfully",
      totalCards: deck.length,
      gameId: gameId,
      cards: deck
    });
  } catch (error) {
    res.status(500).json({ error: "Error initializing deck" });
  }
};

/**
 * Get shuffled deck for a game.
 * 
 * @async
 * @function getShuffledDeck
 * @param {Object} req - Express request object
 * @param {string} req.params.gameId - The ID of the game to get deck for
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export const getShuffledDeck = async (req, res) => {
  try {
    const { gameId } = req.params;
    
    // TODO: validar que gameId exista
    // TODO: verificar que el juego tenga cartas creadas
    const shuffledDeck = await CardService.getShuffledDeck(gameId);
    
    res.status(200).json({
      gameId: gameId,
      totalCards: shuffledDeck.length,
      cards: shuffledDeck
    });
  } catch (error) {
    res.status(500).json({ error: "Error getting shuffled deck" });
  }
};
