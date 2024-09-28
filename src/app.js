import { list, formatList, format, add, findByStatus } from './todo.js';
import { display } from './display.js';
import { AppError } from './app-error.js';
import { validateAddParams, validateFindByStatusParam } from './validate.js';

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
    case 'find-by-status':
      const validatedStatus = validateFindByStatusParam(params);
      display(findByStatus(todoStore, validatedStatus));
      break;
    default:
      throw new AppError(`Unknown command: ${command}`)
  }
}
