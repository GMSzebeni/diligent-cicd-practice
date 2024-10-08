import {
  list,
  formatList,
  format,
  add,
  findByStatus,
  findById,
  complete,
} from "./todo.js";
import { display } from "./display.js";
import { AppError } from "./app-error.js";
import {
  validateAddParams,
  validateFindByStatusParam,
  validateIfIdIsNumber,
} from "./validate.js";

export function createApp(todoStore, args) {
  const [, , command, ...params] = args;

  switch (command) {
    case "list":
      const todos = list(todoStore);
      display([...formatList(todos), `You have ${todos.length} todos.`]);
      break;
    case "add":
      const validatedAdd = validateAddParams(params);
      const added = add(todoStore, validatedAdd);
      display(["New Todo added:", format(added)]);
      break;
    case "find-by-id":
      const id = Number(params[0]);
      const validatedFindByID = validateIfIdIsNumber(id);
      const todo = findById(todoStore, validatedFindByID);
      display(["Todo found:", format(todo)]);
      break;
    case "find-by-status":
      const validatedStatus = validateFindByStatusParam(params);
      display(findByStatus(todoStore, validatedStatus));
      break;
    case "complete":
      const completeValidated = validateIfIdIsNumber(params);
      const completed = complete(todoStore, completeValidated);
      display(["ToDo completed", format(completed)]);
      break;
    default:
      throw new AppError(`Unknown command: ${command}`);
  }
}
