import { list, formatList, format, add, findByStatus } from './todo.js';
import { display } from './display.js';
import { AppError } from './app-error.js';
import { validateAddParams } from './validate.js';

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
      const validated = validateAddParams(params);
      const added = add(todoStore, validated);
      display(['New Todo added:', format(added)])
      break;
    case 'find-by-status':
      const [statusParam] = params;
      if (statusParam === 'done' || statusParam === 'not-done') {
        const status = statusParam === 'done';
        const filteredTodos = findByStatus(todoStore, status);
        if(filteredTodos.length === 0) {
          display([
            ...formatList(filteredTodos),
            `You have no todos that are ${statusParam}.`
          ]);
        } else {
          display([
          ...formatList(filteredTodos),
          `You have ${filteredTodos.length} todos that are ${statusParam}.`
        ]);
        }
      } else {
        throw new AppError('Invalid status. Use "done" or "not-done".');
      }
      break;
    default:
      throw new AppError(`Unknown command: ${command}`)
  }
}
