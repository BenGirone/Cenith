import {
  GameEngine,
  NewGameInitializer,
  SavedGameInitializer,
} from "../model/GameEngine";
import { IGameRepository } from "../types/IGameRepository";
import {
  IGameService,
  MoveRequest,
  NewGameRequest,
  StateWithErrors,
} from "../types/IGameService";
import { UNKNOWN_ERROR } from "../types/errors.consts";
import { GameState } from "../types/types";
import shortid from "shortid";

// Is this a bad way of storing live games... probably.
// But, would you be shocked if I told you that lichess.org and chess.com do something similar.
// We would absolutely need to move this to something like redis if we intend to scale out though.
// Otherwise each instance would have an incomplete list of active games.
// And we could of course use dependency injection here to inject an ILiveGameStorage interface. But I wont lol >:)
const liveGames: { [id: string]: GameEngine } = {};

export class GameService extends IGameService {
  constructor(public repository: IGameRepository) {
    super();
  }

  formatError(
    id: string | undefined,
    state: GameState | undefined,
    error: unknown
  ): StateWithErrors {
    const errorMessage: string =
      (error instanceof Error && error.message) || UNKNOWN_ERROR;

    return {
      id: id || "-1",
      state,
      errors: [errorMessage],
    };
  }

  async makeNewGame({
    rows,
    columns,
    difficulty,
  }: NewGameRequest): Promise<StateWithErrors> {
    try {
      const initializer = new NewGameInitializer(rows, columns, difficulty);
      const newGame = new GameEngine(initializer);
      const id = shortid.generate();

      liveGames[id] = newGame;

      return {
        id,
        state: newGame.getState(),
        errors: [],
      };
    } catch (error) {
      return this.formatError(undefined, undefined, error);
    }
  }

  async saveGame(id: string): Promise<StateWithErrors> {
    try {
      const game = liveGames[id];

      if (!game) throw new Error("Game not found");

      const state = game.getState();
      await this.repository.Save(id, state);

      return {
        id,
        state,
        errors: [],
      };
    } catch (error) {
      return this.formatError(id, undefined, error);
    }
  }

  async loadGame(id: string): Promise<StateWithErrors> {
    try {
      const game = liveGames[id];

      if (game)
        return {
          id,
          state: game.getState(),
          errors: [],
        };

      const state = await this.repository.Load(id);
      const initializer = new SavedGameInitializer(state.board, state.player);
      const loadedGame = new GameEngine(initializer);

      liveGames[id] = loadedGame;

      return {
        id,
        state,
        errors: [],
      };
    } catch (error) {
      return this.formatError(id, undefined, error);
    }
  }

  async move({ id, direction }: MoveRequest): Promise<StateWithErrors> {
    try {
      const game = liveGames[id];

      game.move(direction);

      const state = game.getState();

      return {
        id,
        state,
        errors: [],
      };
    } catch (error) {
      return this.formatError(id, undefined, error);
    }
  }
}
