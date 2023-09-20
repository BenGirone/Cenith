import {
  GAME_OVER_ERROR,
  ILLEGAL_MOVE_ERROR,
  INVALID_MOVE_ERROR,
  OUT_OF_BOUNDS_ERROR,
} from "../types/errors.consts";
import {
  Difficulty,
  MoveDirection,
  Player,
  PlayerPosition,
  Tile,
  TileState,
  TileType,
} from "../types/types";

// I want to assign new players to the object value not the object reference
// so we make this a function instead of a variable
const DEFAULT_PLAYER = () => ({
  position: { column: 0, row: 0 },
  moves: 450,
  health: 200,
});

export class NewGameInitializer {
  constructor(
    public readonly rows: number,
    public readonly cols: number,
    public readonly difficulty: Difficulty
  ) {}
}

export class SavedGameInitializer {
  constructor(
    public readonly gameBoard: Tile[][],
    public readonly gamePlayer: Player
  ) {}
}

export class GameEngine {
  public gameBoard: Tile[][];
  public gamePlayer: Player;

  constructor(initializer: NewGameInitializer | SavedGameInitializer) {
    if (initializer instanceof SavedGameInitializer) {
      this.gameBoard = initializer.gameBoard;
      this.gamePlayer = initializer.gamePlayer;
      return;
    }

    const { rows, cols, difficulty } = initializer;

    this.gameBoard = this.generateBoard(rows, cols, difficulty);
    this.gamePlayer = DEFAULT_PLAYER();
  }

  getState() {
    return {
      board: this.gameBoard,
      player: this.gamePlayer,
    };
  }

  generateBoard(rows: number, cols: number, difficulty: Difficulty) {
    const matrix: Tile[][] = [];
    const flatDifficulty = Object.entries(difficulty);

    for (let i = 0; i < rows; i++) {
      const row: Tile[] = [];

      for (let j = 0; j < cols; j++) {
        let randomValue = Math.random();
        let cumulativeProbability = 0;

        for (let k = 0; k < flatDifficulty.length; k++) {
          cumulativeProbability += flatDifficulty[k][1];
          if (randomValue < cumulativeProbability) {
            row.push({
              tileType: flatDifficulty[k][0] as TileType,
              tileState: TileState.IDLE,
            });
            break;
          }
        }
      }

      matrix.push(row);
    }

    matrix[0][0] = { tileState: TileState.START, tileType: TileType.BLANK };
    matrix[rows - 1][cols - 1] = {
      tileState: TileState.END,
      tileType: TileType.BLANK,
    };

    return matrix;
  }

  getPlayerTile() {
    const { row, column } = this.gamePlayer.position;
    return this.gameBoard[row] && this.gameBoard[row][column];
  }

  canPlayerMove() {
    return this.gamePlayer.health > 0 && this.gamePlayer.moves > 0;
  }

  move(direction: MoveDirection) {
    const currentTile = this.getPlayerTile();

    if (!currentTile) throw new Error(OUT_OF_BOUNDS_ERROR);

    if (currentTile.tileState === TileState.END || !this.canPlayerMove())
      throw new Error(GAME_OVER_ERROR);

    const newPosition: PlayerPosition = {
      row: this.gamePlayer.position.row,
      column: this.gamePlayer.position.column,
    };

    switch (direction) {
      case MoveDirection.NORTH:
        newPosition.row -= 1;
        break;
      case MoveDirection.SOUTH:
        newPosition.row += 1;
        break;
      case MoveDirection.EAST:
        newPosition.column += 1;
        break;
      case MoveDirection.WEST:
        newPosition.column -= 1;
        break;
      default:
        throw new Error(INVALID_MOVE_ERROR);
    }

    const newTile =
      this.gameBoard[newPosition.row] &&
      this.gameBoard[newPosition.row][newPosition.column];

    // validate position
    if (!newTile) throw new Error(ILLEGAL_MOVE_ERROR);

    if (newTile.tileState !== TileState.END) {
      currentTile.tileState = TileState.VISITED;
      newTile.tileState = TileState.ACTIVE;
    }

    // update player
    this.gamePlayer.position = newPosition;
    switch (newTile.tileType) {
      case TileType.BLANK:
        this.gamePlayer.moves -= 1;
        break;
      case TileType.LAVA:
        this.gamePlayer.moves -= 10;
        this.gamePlayer.health -= 50;
        break;
      case TileType.MUD:
        this.gamePlayer.moves -= 5;
        this.gamePlayer.health -= 10;
        break;
      case TileType.SPEEDER:
        this.gamePlayer.health -= 5;
        break;
      default:
        break;
    }
  }
}
