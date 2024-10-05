import express, { Express } from "express";
import cors from "cors";
import { AddressInfo } from "net";

async function main() {
  const app: Express = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.disable("x-powerd-by");

  const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true,
    optionsSuccessStatus: 200,
  };

  app.use(cors(corsOptions));

  const sever = app.listen(4000, () => {
    const address = sever.address() as AddressInfo;
    console.log("Node.js is listening to PORT:" + address.port);
  });

  app.get("/", async (req, res) => {
    res.json("テスト");
  });
}
main();
