import { Difficulty, GameState, MoveDirection } from "./types";

export class IGameService {
  async makeNewGame(request: NewGameRequest): Promise<StateWithErrors> {
    throw new Error("Not Implemented");
  }
  async saveGame(id: string): Promise<StateWithErrors> {
    throw new Error("Not Implemented");
  }
  async loadGame(id: string): Promise<StateWithErrors> {
    throw new Error("Not Implemented");
  }
  async move(request: MoveRequest): Promise<StateWithErrors> {
    throw new Error("Not Implemented");
  }
}

export type NewGameRequest = {
  rows: number;
  columns: number;
  difficulty: Difficulty;
};

export type MoveRequest = {
  id: string;
  direction: MoveDirection;
};

export type StateWithErrors = {
  id: string;
  state: GameState | undefined;
  errors: string[];
};
