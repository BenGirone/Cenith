import express from "express";
import dotenv from "dotenv";

import { GameService } from "./service/index";
import { GameRouter } from "./routes/index";
import { FileGameRepository } from "./repository/FileGameRepository";

dotenv.config();

const app = express();
const router = express.Router();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", router);

// Just a bit of glue code so we will do DI without an IOC library.
GameRouter(router, new GameService(new FileGameRepository()));

app.listen(process.env.PORT, () => {
  console.log(`server running on ${process.env.PORT}`);
});
