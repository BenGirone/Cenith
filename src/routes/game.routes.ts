import { Router, Response, Request } from "express";
import { IGameService } from "../types/IGameService";

// In a real product I would be a lot more dilligent about formatting errors here.
// It's important to hide any implementation details from leaking into the errors,
// and its important to give clients as much as possible to work with.

export const GameRouter = (router: Router, service: IGameService): void => {
  router.get("/load", async (req: Request, res: Response) => {
    try {
      const { id } = req.body;
      const data = await service.loadGame(id);
      res.status(200).send(data);
    } catch (err) {
      res.status(500).send({ err: err });
    }
  });

  router.post("/save", async (req: Request, res: Response) => {
    try {
      const { id } = req.body;
      const data = await service.saveGame(id);
      res.status(200).send(data);
    } catch (err) {
      res.status(500).send({ err: err });
    }
  });

  router.post("/new", async (req: Request, res: Response) => {
    try {
      const { rows, columns, difficulty } = req.body;
      const formatted = {
        rows: Number(rows),
        columns: Number(columns),
        difficulty: JSON.parse(difficulty),
      };
      const data = await service.makeNewGame(formatted);
      res.status(200).send(data);
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  });

  router.put("/move", async (req: Request, res: Response) => {
    try {
      const { id, direction } = req.body;
      const data = await service.move({ id, direction });
      res.status(200).send(data);
    } catch (error) {
      res.status(500).send(error);
    }
  });
};
