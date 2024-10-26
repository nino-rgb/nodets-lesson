import axios from "axios";
import * as dotenv from "dotenv";
import { Todo } from "../../models/todo";
import { createDBConnection } from "../utils/DataBase";
import { Connection, RowDataPacket } from "mysql2/promise";
import { createTodoTestData } from "../utils/testData/createTodoTestData";

dotenv.config();
const { PORT } = process.env;

axios.defaults.baseURL = `http://localhost:${PORT}`;
axios.defaults.headers.common = { "Content-Type": "application/json" };
axios.defaults.validateStatus = (status) => status >= 200 && status < 500;

let connection: Connection;

beforeEach(async () => {
  connection = await createDBConnection();
  connection.query("delete from todos");
});

afterEach(async () => {
  await connection.end();
});

describe("TodoApi", () => {
  describe("GET /api/todos", () => {
    it("should return 5 todos and 200 status", async () => {
      const createdTodoList: Todo[] = await createTodoTestData(connection, 5);
      const response = await axios.get<Todo[]>("/api/todos");

      expect(response.status).toBe(200);
      expect(response.data.length).toBe(5);

      for (const todo of response.data) {
        const expectTodo = createdTodoList.filter((t) => t.id === todo.id)[0];
        expect(todo.id).toBe(expectTodo.id);
        expect(todo.title).toBe(expectTodo.title);
        expect(todo.description).toBe(expectTodo.description);
      }
    });
    it("should return empty todos and 200 status", async () => {
      const response = await axios.get<Todo[]>("/api/todos");
      expect(response.status).toBe(200);
      expect(response.data.length).toBe(0);
    });
  });
  describe("GET /api/todos/:id", () => {
    it("should return 5 todos and 200 status", async () => {
      const createdTodoList: Todo[] = await createTodoTestData(connection, 1);
      const expectTodo = createdTodoList[0];
      const response = await axios.get<Todo>(`/api/todos/${expectTodo.id}`);

      expect(response.status).toBe(200);

      expect(response.data.id).toBe(expectTodo.id);
      expect(response.data.title).toBe(expectTodo.title);
      expect(response.data.description).toBe(expectTodo.description);
    });
    it("should return 404 status", async () => {
      const response = await axios.get<Todo>(`/api/todos/0`);
      expect(response.status).toBe(404);
    });
  });
  describe("POST /api/todos/", () => {
    it("should return createdID 201 status", async () => {
      const request: Todo = {
        title: "title",
        description: "description",
      };
      const response = await axios.post<number>("/api/todos", request);
      const createdID = response.data;

      const query = `select * from todos where id = ${createdID}`;
      const [rows] = await connection.execute<Todo[] & RowDataPacket[]>(query);
      const queryResult = rows[0] as Todo;

      expect(response.status).toBe(201);
      expect(queryResult.id).toBe(createdID);
      expect(queryResult.title).toBe(request.title);
      expect(queryResult.description).toBe(request.description);
    });
  });
  describe("PUT /api/todos/:id", () => {
    it("should return 200 status", async () => {
      const createdTodoList: Todo[] = await createTodoTestData(connection, 1);
      const createdID = createdTodoList[0].id!;

      const request: Todo = {
        title: "updated title",
        description: "updated description",
      };

      const response = await axios.put(`/api/todos/${createdID}`, request);

      const query = `select * from todos where id = ${createdID}`;
      const [rows] = await connection.execute<Todo[] & RowDataPacket[]>(query);
      const queryResult = rows[0] as Todo;

      expect(response.status).toBe(200);
      expect(queryResult.id).toBe(createdID);
      expect(queryResult.title).toBe(request.title);
      expect(queryResult.description).toBe(request.description);
    });
    it("should return 404 status", async () => {
      const request: Todo = {
        title: "updated title",
        description: "updated description",
      };
      const response = await axios.put(`/api/todos/0`, request);
      expect(response.status).toBe(404);
    });
  });
  describe("DELETE /api/todos/:id", () => {
    it("should return 204 status", async () => {
      const createdTodoList: Todo[] = await createTodoTestData(connection, 1);
      const createdID = createdTodoList[0].id!;

      const response = await axios.delete(`/api/todos/0${createdID}`);

      const query = `select * from todos where id = ${createdID}`;
      const [rows] = await connection.execute<Todo[] & RowDataPacket[]>(query);

      expect(response.status).toBe(204);
      expect(rows.length).toBe(0);
    });
  });
});
