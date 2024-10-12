import express, { Express, Request, Response } from "express";
import cors from "cors";
import { AddressInfo } from "net";
import * as dotenv from "dotenv";
import mysql, { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { todo } from "node:test";
import { title } from "process";
import { parse } from "path";
import { ok } from "assert";
import { json } from "stream/consumers";
import { TodoReository } from "./repositories/todoRepository";
import { TodoService } from "./services/todoService";
import { TodoController } from "./controllers/todoController";

async function main() {
  dotenv.config();
  const { PORT, MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASS, MYSQL_DB } = process.env;

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

  const sever = app.listen(parseInt(PORT as string), () => {
    const address = sever.address() as AddressInfo;
    console.log("Node.js is listening to PORT:" + address.port);
  });

  const connection = await mysql.createConnection({
    host: MYSQL_HOST as string,
    port: parseInt(MYSQL_PORT as string),
    user: MYSQL_USER as string,
    password: MYSQL_PASS as string,
    database: MYSQL_DB as string,
  });

  const repository = new TodoReository(connection);
  const service = new TodoService(repository);
  const controller = new TodoController(service);
  app.use("/api/", controller.router);
}
main();
