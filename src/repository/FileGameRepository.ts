import fs from "fs";
import { IGameRepository } from "../types/IGameRepository";
import { GameState } from "../types/types";
import path from "path";

export class FileGameRepository extends IGameRepository {
  constructor() {
    if (!fs.existsSync("data")) fs.mkdirSync("data");
    super();
  }

  async Load(id: string): Promise<GameState> {
    try {
      const data: GameState = JSON.parse(
        fs.readFileSync(path.join("data", id + ".json")).toString()
      );

      return data;
    } catch (error) {
      throw new Error("Could not load game");
    }
  }

  async Save(id: string, state: GameState): Promise<boolean> {
    try {
      fs.writeFileSync(path.join("data", id + ".json"), JSON.stringify(state));
      return true;
    } catch (error) {
      throw new Error("Could not save file");
    }
  }
}
