import { list, formatList, format, add, findByStatus, findById, deleteToDo } from './todo.js';
import { display } from './display.js';
import { AppError } from './app-error.js';
import { validateAddParams, validateFindByStatusParam, validateFindById, validateDeleteToDoParams } from './validate.js';

export function createApp(todoStore, args) {
  const [, , command, ...params] = args;

  switch (command) {
    case 'list':
      const todos = list(todoStore)
      display([
        ...formatList(todos), 
        `You have ${todos.length} todos.`
      ]);
      break;
    case 'add':
      const validatedAdd = validateAddParams(params);
      const added = add(todoStore, validatedAdd);
      display(['New Todo added:', format(added)])
      break;
      case 'find-by-id':
        const id = Number(params[0])
        const validatedFindByID = validateFindById(id)
        const todo = findById(todoStore, params[0]);
        if (!todo) {
          display([`Todo with ID ${validatedFindByID} not found.`]);
      } else {
          display(['Todo found:', format(todo)]);
      }
        break;
    case 'find-by-status':
      const validatedStatus = validateFindByStatusParam(params);
      display(findByStatus(todoStore, validatedStatus));
      break;
    case 'delete':
      const validatedDelete = validateDeleteToDoParams(params);
      deleteToDo(todoStore, validatedDelete);
      display(['Todo deleted.'])
      break;
    default:
      throw new AppError(`Unknown command: ${command}`)
  }
}
