import { GameState } from "./types";

export class IGameRepository {
  async Load(id: string): Promise<GameState> {
    throw new Error("not implemented");
  }
  async Save(id: string, state: GameState): Promise<boolean> {
    throw new Error("not implemented");
  }
}
