// FindAll,GetById,Create,Delete
//  - TODOが複数返却されること
//  - TodoRepositoryがエラーを起こしたとき
//  Updata
//   - 指定したIDのTODOが正常に更新されているかこと（）
//   - TodoRepository.update()がエラーを返却したら、エラーになること
import { createDeflate } from "zlib";
import { TodoReository } from "../../../repositories/todoRepository";
import { create } from "domain";
import { Connection } from "mysql2/typings/mysql/lib/Connection";
import { title } from "process";
import { TodoService } from "../../../services/todoService";
import { ITodoRepository } from "../../../repositories/interface";
import { Todo } from "../../../models/todo";

function createMockRepository(): ITodoRepository {
  const mockRepository: ITodoRepository = {
    findAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
  return mockRepository;
}

function createMockTodoList(num: number): Todo[] {
  const todoList: Todo[] = [];

  for (let index = 0; index < num; index++) {
    const todo: Todo = {
      id: index,
      title: `title_${index}`,
      description: `description_${index}`,
    };
    todoList.push(todo);
  }

  return todoList;
}

describe("TodoService", () => {
  describe("findAll", () => {
    it("should return 5 todo", async () => {
      const todoList: Todo[] = createMockTodoList(5);
      const mockRepository = createMockRepository();
      mockRepository.findAll = jest.fn().mockResolvedValue(todoList);

      const service = new TodoService(mockRepository);
      const result = await service.findAll();

      if (result instanceof Error) {
        throw new Error(`Test faild because an error has occurred: ${result.message}`);
      }

      expect(result.length).toBe(5);

      for (let index = 0; index < todoList.length; index++) {
        expect(result[index].id).toBe(todoList[index].id);
        expect(result[index].title).toBe(todoList[index].title);
        expect(result[index].description).toBe(todoList[index].description);
      }
    });
    it("should return repository error", async () => {
      const mockRepository = createMockRepository();
      mockRepository.findAll = jest.fn().mockResolvedValue(new Error("repository error"));

      const service = new TodoService(mockRepository);
      const result = await service.findAll();

      if (!(result instanceof Error)) {
        throw new Error("Test failed because an error has not occurred");
      }

      expect(result.message).toBe("repository error");
    });
  });
});
