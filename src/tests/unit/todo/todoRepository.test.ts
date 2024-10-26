import { Connection, RowDataPacket } from "mysql2/promise";
import { Todo } from "../../../../src/models/todo";
import { TodoReository } from "../../../../src/repositories/todoRepository";
import { NotFoundDataError, SqlError } from "../../../../src/utils/error";
import { createDBConnection } from "../../utils/DataBase";
import { before } from "node:test";
import { createTodoTestData } from "../../utils/testData/createTodoTestData";

let connection: Connection;

beforeEach(async () => {
  connection = await createDBConnection();
  connection.query(`delete from todos`);
});

afterEach(async () => {
  await connection.end();
});

describe("TodoRepository", () => {
  describe("findAll", () => {
    it("should return 5 todo", async () => {
      const repository = new TodoReository(connection);
      const createTodoList = await createTodoTestData(connection, 5);

      const result = await repository.findAll();
      if (result instanceof Error) {
        throw new Error(`Test Failed an error gas occurred: ${result.message}`);
      }

      for (const todo of result) {
        const expectTodo = createTodoList.filter((t) => t.id === todo.id)[0];
        expect(todo.id).toBe(expectTodo.id);
        expect(todo.title).toBe(expectTodo.title);
        expect(todo.description).toBe(expectTodo.description);
      }
    });

    it("should return empty", async () => {
      const repository = new TodoReository(connection);

      const result = await repository.findAll();
      if (result instanceof Error) {
        throw new Error(`Test failed because an error has occurred: ${result.message}`);
      }
      expect(result.length).toBe(0);
    });
  });

  describe("getById", () => {
    it("should return todo", async () => {
      const repository = new TodoReository(connection);
      const [todo] = await createTodoTestData(connection, 1);

      const result = await repository.getById(todo.id!);
      if (result instanceof Error) {
        throw new Error(`Test failed because an error has occurred: ${result.message}`);
      }

      expect(result.id).toBe(todo.id);
      expect(result.title).toBe(todo.title);
      expect(result.description).toBe(todo.description);
    });

    it("should return notfound error", async () => {
      const repository = new TodoReository(connection);
      const result = await repository.getById(1);

      if (!(result instanceof Error)) {
        throw new Error("Test failed because no error occurred");
      }

      expect(result instanceof NotFoundDataError).toBeTruthy();
    });

    it("should return sqlError", async () => {
      const mockConnection = {
        excute: jest.fn().mockRejectedValue(new Error("Mocked SQL Error")),
      } as unknown as Connection;

      const repository = new TodoReository(mockConnection);

      const result = await repository.getById(1);

      expect(result instanceof SqlError).toBeTruthy();
    });
  });
});
