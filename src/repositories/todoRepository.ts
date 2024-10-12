import { RowDataPacket, Connection, ResultSetHeader } from "mysql2/promise";
import { Todo } from "../models/todo";
import { NotFoundDataError, SqlError } from "../utils/error";
import { todo } from "node:test";
import { isDataView } from "node:util/types";
import { title } from "node:process";

export class TodoReository {
  private connection: Connection;

  constructor(connection: Connection) {
    this.connection = connection;
  }

  public async findAll(): Promise<Todo[] | Error> {
    try {
      const sql = "SELECT * FROM todos";
      const [rows] = await this.connection.execute<Todo[] & RowDataPacket[]>(sql);
      return rows;
    } catch (error) {
      return new SqlError(`TodoRepository.findAll() Error: ${error}`);
    }
  }

  public async getById(id: number): Promise<Todo | Error> {
    try {
      const sql = "SELECT * FROM todos WHERE id = ?";
      const [rows] = await this.connection.execute<Todo[] & RowDataPacket[]>(sql, [id]);

      if (rows.length === 0) {
        return new NotFoundDataError(`todo not found`);
      }
      return rows[0];
    } catch (error) {
      return new SqlError(`TodoRepository.getById(): ${error}`);
    }
  }

  public async create(todo: Todo): Promise<number | Error> {
    try {
      const sql = "INSERT INTO todos(title,description) values(?,?)";
      const [result] = await this.connection.query<ResultSetHeader>(sql, [todo.title, todo.description]);
      return result.insertId;
    } catch (error) {
      return new SqlError(`TodoRipository.create() ERROR: ${error}`);
    }
  }

  public async update(id: number, todo: Todo): Promise<void | Error> {
    try {
      const sql = "UPDATE todos SET title = ?, description = ? WHERE id = ?";
      await this.connection.query<ResultSetHeader>(sql, [todo.title, todo.description, id]);
    } catch (error) {
      return new SqlError(`TodoRepository.update() ERROR: ${error}`);
    }
  }

  public async delete(id: number): Promise<void | Error> {
    try {
      const sql = "DELETE FROM todos WHERE id = ?";
      await this.connection.query<ResultSetHeader>(sql, id);
    } catch (error) {
      return new SqlError(`TodoRepository.delete() ERROR: ${error}`);
    }
  }
}
