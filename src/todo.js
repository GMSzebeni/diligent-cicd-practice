import { AppError } from "./app-error.js";

export function format(todo) {
  return `${todo.id} - [${todo.done ? "x" : " "}] ${todo.title} (${
    todo.labels
  })`;
}

export function formatList(todos) {
  return todos.map(format);
}

function nextId(todos) {
  const ids = todos.map((todo) => todo.id);
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
  const todos = store.get();
  const newTodo = {
    title,
    done: false,
    id: nextId(todos),
    labels: [],
  };
  const toStore = [...todos, newTodo];
  store.set(toStore);
  return newTodo;
}

export function findByStatus(store, validatedStatus) {
  const status = validatedStatus === "done";
  const todos = store.get();
  const filteredTodos = todos.filter((todo) => todo.done === status);
  if (filteredTodos.length === 0) {
    return [`You have no todos that are ${validatedStatus}.`];
  } else {
    return [
      ...formatList(filteredTodos),
      `You have ${filteredTodos.length} todos that are ${validatedStatus}.`,
    ];
  }
}

export function findById(store, id) {
  const todos = store.get();
  const todo = todos.find((t) => t.id === id);

  if (!todo) {
    throw new AppError(`Todo could not be found with the id ${id}`);
  }

  return todo;
}

export function complete(store, id) {
  const todos = store.get();

  const todo = findById(store, id);

  if (!todo) {
    throw new AppError(`Todo could not be found with the id ${id}`);
  }

  todo.done = true;

  store.set(todos);

  return todo;
}

export function editTitle(store, id, newTitle) {
  let todo = findById(store, id);

  todo = { ...todo, title: newTitle };

  const todos = store.get();
  const updatedTodos = todos.map((t) => (t.id === id ? todo : t));
  store.set(updatedTodos);

  const updatedTodo = findById(store, id);
  return updatedTodo;
}

export function addLabel(store, id, label) {
  const todo = findById(store, id);

  if (!todo.labels.find((l) => l === label)) {
    todo.labels.push(label);
  }

  const todos = store.get();
  const updatedTodos = todos.map((t) => (t.id === id ? todo : t));
  store.set(updatedTodos);

  const updatedTodo = findById(store, id);
  return updatedTodo;
}
