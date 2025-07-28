import Card from "../models/card-model.js";
// TODO: validar color: red, blue, green, yellow, black
// TODO: validar value: 0-9, Skip, Reverse, Draw Two, Wild, Wild Draw Four
/**
 * Creates a new card
 * @async
 * @param {Object} cardData - The data for the card
 * @param {string} cardData.color - Card color 
 * @param {string} cardData.value - Card value 
 * @param {number} cardData.gameId - The ID of the game this card belongs to
 * @returns {Promise<Card>} The created card
 */
export const createCard = async (cardData) => {
  return await Card.create(cardData);
};

/**
 * Get all cards 
 * @async
 * @param {number} gameId - game ID to filter cards
 * @returns {Promise<Card[]>} List of cards for specific game
 */
export const getAllCards = async (gameId) => {
  if (gameId) {
    return await Card.findAll({ where: { gameId } });
  }
  return await Card.findAll();
};

/**
 * Get a single card by its ID.
 * @async
 * @param {number} id - The ID of the card to get
 * @returns {Promise<Card|null>} The card or null if not found
 */
export const getCardById = async (id) => {
  return await Card.findByPk(id);
};

/**
 * Update a card in the database.
 * @param {number} id - The ID of the card
 * @param {Object} cardData - New data for the card
 * @returns {Promise<Card|null>} Updated card or null if not found
 */
export const updateCard = async (id, cardData) => {
  const card = await Card.findByPk(id);
  if (!card) {
    return null;
  }
  await card.update(cardData);
  return card;
};

/**
 * Delete a card from database.
 * @async
 * @param {number} id - The ID of the card to delete
 * @returns {Promise<boolean>} True if deleted, false if not found
 */
export const deleteCard = async (id) => {
  const card = await Card.findByPk(id);
  if (!card) {
    return false;
  }
  await card.destroy();
  return true;
};

/**
 * Initialize a complete UNO deck for a game.
 * Creates all 108 cards that come in a standard UNO deck.
 * 
 * @async
 * @param {number} gameId - The ID of the game to create deck for
 * @returns {Promise<Card[]>} Array of all created cards
 */
export const initializeDeck = async (gameId) => {
  const deck = [];

  // Normal colors
  const colors = ['red', 'blue', 'green', 'yellow'];
  
  /**
   * Create this cards
   * For every color:
   * 1x 0 card -> 1 card
   * 2x of every number between 1-9 -> 18 cards
   * Special card with color:
   * x2 of skip, reverse, draw two -> 6 cards
   * ---
   * 25 cards * 4 colors = 100 cards
   * 
   * Special (black) cards:
   * 4x Wild (Cambio de color) and 4x Wild Draw Four (+4) -> 8 cards
   * ---
   * Total: 100 + 8 = 108 cards
   *
   * ---
    TODO: REAJUSTAR ESTO:
   * Nota: solo hay un 0 por color
   *  hay 4x de cada carta negra
   */
  for (const color of colors) {
    // Generate the 0 card
    deck.push({ color, value: '0', gameId });

    // Generate cards 1-9: two of every number per color
    for (let num = 1; num <= 9; num++) {
      deck.push({ color, value: num.toString(), gameId });
      deck.push({ color, value: num.toString(), gameId });
    }
    
    // generate special cards
    const specialCards = ['Skip', 'Reverse', 'Draw Two'];
    for (const special of specialCards) {
      deck.push({ color, value: special, gameId });
      deck.push({ color, value: special, gameId });
    }
  }
  
  // generate 4 cards for every special cards
  for (let i = 0; i < 4; i++) {
    deck.push({ color: 'black', value: 'Wild', gameId });
    deck.push({ color: 'black', value: 'Wild Draw Four', gameId });
  }
  
  // Push to the database
  const createdCards = await Card.bulkCreate(deck);
  
  // TODO:  es necesario barajarlo aqui?
  return shuffleCards(createdCards);
};

/**
 * Shuffle an array of cards.
 * 
 * @param {Array} cards - Array of cards to shuffle
 * @returns {Array} Shuffled array of cards
 */
export const shuffleCards = (cards) => {
  const shuffled = [...cards]; // inmutabilidad
  for (let i = shuffled.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    
    // Shuffle positions
    [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
  }
  
  return shuffled;
};

/**
 * Get cards shuffled for a specific game
 * 
 * @async
 * @param {number} gameId - The ID of the game
 * @returns {Promise<Card[]>} Shuffled deck of cards for the game
 */
export const getShuffledDeck = async (gameId) => {
  const cards = await getAllCards(gameId);
  return shuffleCards(cards);
};
