export const GAME_STATUS = {
  INACTIVE: "inactive",
  ACTIVE: "active", 
  FINISHED: "finished",
};

export const PLAYER_STATUS = {
  WAITING: "waiting",
  PLAYING: "playing", 
  LEFT: "left",
  FINISHED: "finished",
};

export const CARD_COLORS = {
  RED: "red",
  BLUE: "blue", 
  GREEN: "green",
  YELLOW: "yellow",
  WILD: "wild",
};

export const CARD_TYPES = {
  NUMBER: "number",
  SKIP: "skip",
  REVERSE: "reverse", 
  DRAW_TWO: "draw_two",
  WILD: "wild",
  WILD_DRAW_FOUR: "wild_draw_four",
};

export const GAME_RULES = {
  MIN_PLAYERS: 2,
  MAX_PLAYERS: 10,
  INITIAL_CARDS: 7,
};

export const TURN_DIRECTION = {
  CLOCKWISE: "clockwise",
  COUNTERCLOCKWISE: "counterclockwise", 
};
