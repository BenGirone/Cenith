export type Tile = {
  tileType: TileType;
  tileState: TileState;
};

export enum TileType {
  BLANK = "BLANK",
  SPEEDER = "SPEEDER",
  LAVA = "LAVA",
  MUD = "MUD",
}

export enum TileState {
  START = "START",
  IDLE = "IDLE",
  VISITED = "VISITED",
  ACTIVE = "ACTIVE",
  END = "END",
}

export enum MoveDirection {
  NORTH = "NORTH",
  SOUTH = "SOUTH",
  EAST = "EAST",
  WEST = "WEST",
}

export type Player = {
  position: PlayerPosition;
  health: number;
  moves: number;
};

export type PlayerPosition = {
  row: number;
  column: number;
};

export type GameState = {
  player: Player;
  board: Tile[][];
};

// A difficulty will be probabilities of each tile.
// We will leave specific definitions of "easy", "normal", "hard" to the frontend
export type Difficulty = {
  [TileType.BLANK]: number;
  [TileType.SPEEDER]: number;
  [TileType.LAVA]: number;
  [TileType.MUD]: number;
};
