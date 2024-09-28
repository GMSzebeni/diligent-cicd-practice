export function format(todo) {
  return `${todo.id} - [${todo.done ? 'x': ' '}] ${todo.title}`;
}

export function formatList(todos) {
  return todos.map(format)
}

function nextId(todos) {
  const ids = todos.map(todo => todo.id);
  if (ids.length === 0) {
    return 1;
  }
  const maxId = Math.max(...ids);
  return maxId + 1;
}

export function list(store) {
  return store.get(); 
}

export function add(store, params) {
  const [title] = params;
  const todos = store.get()
  const newTodo = {
    title,
    done: false,
    id: nextId(todos)
  }
  const toStore = [...todos, newTodo]
  store.set(toStore)
  return newTodo;
}

export function findByStatus(store, validatedStatus) {
  const status = validatedStatus === 'done';
  const todos = store.get();
  const filteredTodos = todos.filter(todo => todo.done === status);
  if(filteredTodos.length === 0) {
    return [`You have no todos that are ${validatedStatus}.`]
  } else {
    return [
    ...formatList(filteredTodos),
    `You have ${filteredTodos.length} todos that are ${validatedStatus}.`];
  }
}

export function complete(store, id) {
  const todos = store.get();

  const toDo = todos.find(td => td.id == id);

  toDo.done = true;

  store.set(todos)

  return toDo;
}