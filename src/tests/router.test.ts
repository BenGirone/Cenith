import express from "express";
import { IGameService, StateWithErrors } from "../types/IGameService";
import request from "supertest";
import { MoveDirection, TileType } from "../types/types";
import { GameRouter } from "../routes";

// These are pretty much just boiler plate for real tests.
// I would configure these to actually show that the game runs correctly if I had more time

const app = express();
const router = express.Router();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", router);

const response: StateWithErrors = {
  id: "1",
  state: {
    player: { health: 1, moves: 1, position: { column: 1, row: 1 } },
    board: [[]],
  },
  errors: [],
};

// Define your service object (mocked for testing purposes)
const service: IGameService = {
  loadGame: async (id: string) => response,
  saveGame: async (id) => response,
  makeNewGame: async (formatted) => response,
  move: async ({ id, direction }) => response,
};

GameRouter(router, service);

app.listen(process.env.PORT, () => {
  console.log(`server running on ${process.env.PORT}`);
});

describe("Routes", () => {
  // Test for /load route
  it("GET /load", async () => {
    const response = await request(app).get("/load").send({ id: 123 });
    expect(response.status).toBe(200);
  });

  // Test for /save route
  it("POST /save", async () => {
    const response = await request(app).post("/save").send({ id: 456 });
    expect(response.status).toBe(200);
  });

  // Test for /new route
  it("POST /new", async () => {
    const response = await request(app)
      .post("/new")
      .send({
        rows: 3,
        columns: 3,
        difficulty: JSON.stringify({
          [TileType.BLANK]: 0.25,
          [TileType.MUD]: 0.25,
          [TileType.LAVA]: 0.25,
          [TileType.SPEEDER]: 0.25,
        }),
      });
    expect(response.status).toBe(200);
  });

  // Test for /move route
  it("PUT /move", async () => {
    const response = await request(app).put("/move").send({
      id: 789,
      direction: MoveDirection.EAST,
    });
    expect(response.status).toBe(200);
  });
});
