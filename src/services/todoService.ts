import { Todo } from "../models/todo";
import { ITodoRepository } from "../repositories/interface";
import { ITodoService } from "./interface";

export class TodoService implements ITodoService {
  private todoRepository: ITodoRepository;

  constructor(todoRepository: ITodoRepository) {
    this.todoRepository = todoRepository;
  }

  public async findAll(): Promise<Todo[] | Error> {
    const result = await this.todoRepository.findAll();
    return result;
  }

  public async getById(id: number): Promise<Todo | Error> {
    const result = await this.todoRepository.getById(id);
    return result;
  }

  public async create(todo: Todo): Promise<number | Error> {
    const result = await this.todoRepository.create(todo);
    return result;
  }

  public async update(id: number, todo: Todo): Promise<void | Error> {
    const getResult = await this.todoRepository.getById(id);

    if (getResult instanceof Error) {
      return getResult;
    }

    const updateRusult = await this.todoRepository.update(id, todo);
    return updateRusult;
  }

  public async delete(id: number): Promise<void | Error> {
    const result = await this.todoRepository.delete(id);
    return result;
  }
}
