import { GameEngine, SavedGameInitializer } from "../model/GameEngine";
import { GAME_OVER_ERROR } from "../types/errors.consts";
import { MoveDirection, Tile, TileState, TileType } from "../types/types";

// Just showing some very light tests here.
// For a production app I would write comprehensive tests for every potential scenario,
// ensure errors are handled correctly etc...

describe("Game Engine", () => {
  it("Can successfully navigate a small map", () => {
    const gameBoard: Tile[][] = [
      [
        { tileState: TileState.START, tileType: TileType.BLANK },
        { tileState: TileState.IDLE, tileType: TileType.SPEEDER },
        { tileState: TileState.IDLE, tileType: TileType.LAVA },
      ],
      [
        { tileState: TileState.IDLE, tileType: TileType.MUD },
        { tileState: TileState.IDLE, tileType: TileType.BLANK },
        { tileState: TileState.IDLE, tileType: TileType.SPEEDER },
      ],
      [
        { tileState: TileState.IDLE, tileType: TileType.LAVA },
        { tileState: TileState.IDLE, tileType: TileType.MUD },
        { tileState: TileState.END, tileType: TileType.BLANK },
      ],
    ];

    const gamePlayer = {
      position: { column: 0, row: 0 },
      moves: 450,
      health: 200,
    };

    const initializer = new SavedGameInitializer(gameBoard, gamePlayer);
    const game = new GameEngine(initializer);

    game.move(MoveDirection.SOUTH);
    game.move(MoveDirection.SOUTH);
    game.move(MoveDirection.EAST);
    game.move(MoveDirection.NORTH);
    game.move(MoveDirection.NORTH);
    game.move(MoveDirection.EAST);
    game.move(MoveDirection.SOUTH);
    game.move(MoveDirection.SOUTH);

    expect(gamePlayer).toMatchObject({
      health: 70,
      moves: 418,
      position: { row: 2, column: 2 },
    });
  });

  it("Can die lol", () => {
    const gameBoard: Tile[][] = [
      [
        { tileState: TileState.START, tileType: TileType.BLANK },
        { tileState: TileState.IDLE, tileType: TileType.SPEEDER },
        { tileState: TileState.IDLE, tileType: TileType.LAVA },
        { tileState: TileState.IDLE, tileType: TileType.MUD },
        { tileState: TileState.END, tileType: TileType.BLANK },
      ],
    ];

    const gamePlayer = {
      position: { column: 0, row: 0 },
      moves: 450,
      health: 50,
    };

    const initializer = new SavedGameInitializer(gameBoard, gamePlayer);
    const game = new GameEngine(initializer);

    game.move(MoveDirection.EAST);
    game.move(MoveDirection.EAST);

    const dieMove = () => {
      game.move(MoveDirection.EAST);
    };

    expect(dieMove).toThrowError(GAME_OVER_ERROR);
  });

  // TODO: make sure you can't move out of bounds, after reaching end tile, make tile specific tests, test the board generation function, etc...
});
