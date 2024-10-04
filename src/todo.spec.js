import { jest } from "@jest/globals";
import {
  add,
  findByStatus,
  format,
  formatList,
  list,
  complete,
  editTitle,
  addLabel,
} from "./todo.js";

function createMockStore(data) {
  return {
    get: jest.fn(() => data),
    set: jest.fn((newData) => {
      data = [...newData];
    }),
  };
}

describe("format", () => {
  it("should format a not done todo", () => {
    const todo = {
      title: "todo title",
      id: 1,
      done: false,
      labels: ["label1", "label2"],
    };
    const expected = "1 - [ ] todo title (label1,label2)";

    const current = format(todo);

    expect(current).toStrictEqual(expected);
  });

  it("should format a done todo", () => {
    const todo = { title: "todo title", id: 1, done: true, labels: ["label1"] };
    const expected = "1 - [x] todo title (label1)";

    const current = format(todo);

    expect(current).toStrictEqual(expected);
  });
});

describe("formatList", () => {
  it("should format a list of todos", () => {
    const todos = [
      { title: "todo title", id: 1, done: true, labels: ["label1"] },
      { title: "todo title 2", id: 2, done: false, labels: ["label2"] },
    ];
    const expected = [
      "1 - [x] todo title (label1)",
      "2 - [ ] todo title 2 (label2)",
    ];

    const current = formatList(todos);

    expect(current).toStrictEqual(expected);
  }),
    it("should return an empty list, if an empty list is given", () => {
      const todos = [];
      const expected = [];

      const current = formatList(todos);

      expect(current).toStrictEqual(expected);
    });
});

describe("list", () => {
  it("should list the todos", () => {
    const mockStore = createMockStore([
      { id: 1, title: "Todo 1", done: false },
      { id: 2, title: "Todo 2", done: true },
    ]);
    const expected = [
      { id: 1, title: "Todo 1", done: false },
      { id: 2, title: "Todo 2", done: true },
    ];

    const current = list(mockStore);

    expect(current).toStrictEqual(expected);
  });

  it("should return an empty list, if nothing is stored", () => {
    const mockStore = createMockStore([]);
    const expected = [];

    const current = list(mockStore);

    expect(current).toStrictEqual(expected);
  });
});

describe("add", () => {
  it("should add a new todo to an empty store, done false, id is 1", () => {
    const params = ["New Todo"];
    const mockStore = createMockStore([]);
    const expected = {
      id: 1,
      done: false,
      title: "New Todo",
      labels: [],
    };

    const current = add(mockStore, params);

    expect(current).toStrictEqual(expected);
    expect(mockStore.set.mock.calls[0][0]).toStrictEqual([expected]);
  });

  it("should append a new todo to the existing items", () => {
    const params = ["New Todo"];
    const stored = [{ id: 1, title: "Todo 1", done: true, labels: [] }];
    const mockStore = createMockStore(stored);
    const expected = {
      id: 2,
      done: false,
      title: "New Todo",
      labels: [],
    };

    const current = add(mockStore, params);

    expect(current).toStrictEqual(expected);
    expect(mockStore.set.mock.calls[0][0]).toStrictEqual([...stored, expected]);
  });

  it("should calculate the id by max id + 1, missing ids in a sequence", () => {
    const params = ["New Todo"];
    const stored = [
      { id: 2, title: "Todo 1", done: true, labels: [] },
      { id: 4, title: "Todo 1", done: true, labels: [] },
    ];
    const mockStore = createMockStore(stored);
    const expected = {
      id: 5,
      done: false,
      title: "New Todo",
      labels: [],
    };

    const current = add(mockStore, params);

    expect(current).toStrictEqual(expected);
    expect(mockStore.set.mock.calls[0][0]).toStrictEqual([...stored, expected]);
  });
});

describe("findByStatus", () => {
  it("should find all todos where status is not-done", () => {
    const params = "not-done";
    const stored = [
      { id: 2, title: "Todo 2", done: false, labels: [] },
      { id: 3, title: "Todo 3", done: true, labels: [] },
      { id: 4, title: "Todo 4", done: false, labels: [] },
    ];
    const mockStore = createMockStore(stored);
    const expected = [
      "2 - [ ] Todo 2 ()",
      "4 - [ ] Todo 4 ()",
      "You have 2 todos that are not-done.",
    ];

    const current = findByStatus(mockStore, params);

    expect(current).toStrictEqual(expected);
  });
  it("should find all todos where status is done", () => {
    const params = "done";
    const stored = [
      { id: 2, title: "Todo 2", done: false, labels: [] },
      { id: 3, title: "Todo 3", done: true, labels: [] },
      { id: 4, title: "Todo 4", done: false, labels: [] },
    ];
    const mockStore = createMockStore(stored);
    const expected = ["3 - [x] Todo 3 ()", "You have 1 todos that are done."];

    const current = findByStatus(mockStore, params);

    expect(current).toStrictEqual(expected);
  });

  it("should show not found message if no todos with done status have been found", () => {
    const params = "done";
    const stored = [
      { id: 2, title: "Todo 2", done: false, labels: [] },
      { id: 3, title: "Todo 3", done: false, labels: [] },
      { id: 4, title: "Todo 4", done: false, labels: [] },
    ];
    const mockStore = createMockStore(stored);
    const expected = ["You have no todos that are done."];

    const current = findByStatus(mockStore, params);

    expect(current).toStrictEqual(expected);
  });

  it("should show not found message if no todos with not-done status have been found", () => {
    const params = "not-done";
    const stored = [
      { id: 2, title: "Todo 2", done: true, labels: [] },
      { id: 3, title: "Todo 3", done: true, labels: [] },
      { id: 4, title: "Todo 4", done: true, labels: [] },
    ];
    const mockStore = createMockStore(stored);
    const expected = ["You have no todos that are not-done."];

    const current = findByStatus(mockStore, params);

    expect(current).toStrictEqual(expected);
  });
});

describe("complete", () => {
  it("should set the given todos done property to true", () => {
    const params = 2;
    const stored = [
      { id: 2, title: "Todo 2", done: false, labels: [] },
      { id: 3, title: "Todo 3", done: true, labels: [] },
      { id: 4, title: "Todo 4", done: false, labels: [] },
    ];
    const mockStore = createMockStore(stored);
    const expected = { id: 2, title: "Todo 2", done: true, labels: [] };

    const current = complete(mockStore, params);

    expect(current).toStrictEqual(expected);
  });

  it("should return the todo without changes if its already done", () => {
    const params = 2;
    const stored = [
      { id: 2, title: "Todo 2", done: true, labels: [] },
      { id: 3, title: "Todo 3", done: true, labels: [] },
      { id: 4, title: "Todo 4", done: false, labels: [] },
    ];
    const mockStore = createMockStore(stored);
    const expected = { id: 2, title: "Todo 2", done: true, labels: [] };

    const current = complete(mockStore, params);

    expect(current).toStrictEqual(expected);
  });
});

describe("editTitle", () => {
  it("should edit title", () => {
    const mockStore = createMockStore([
      { id: 2, title: "Todo 2", done: false, labels: [] },
      { id: 3, title: "Todo 3", done: true, labels: [] },
      { id: 4, title: "Todo 4", done: false, labels: [] },
    ]);

    const expected = {
      id: 4,
      title: "Todo 4 Updated",
      done: false,
      labels: [],
    };

    const current = editTitle(mockStore, 4, "Todo 4 Updated");

    expect(current).toStrictEqual(expected);
  });
});

describe("addLabel", () => {
  it("should add a new lable if the todo does not have the label yet", () => {
    const mockStore = createMockStore([
      { id: 2, title: "Todo 2", done: false, labels: [] },
    ]);

    const expected = {
      id: 2,
      title: "Todo 2",
      done: false,
      labels: ["label1"],
    };

    const current = addLabel(mockStore, 2, "label1");

    expect(current).toStrictEqual(expected);
  });

  it("should not add a lable if the todo already has it", () => {
    const mockStore = createMockStore([
      { id: 2, title: "Todo 2", done: false, labels: ["label1"] },
    ]);

    const expected = {
      id: 2,
      title: "Todo 2",
      done: false,
      labels: ["label1"],
    };

    const current = addLabel(mockStore, 2, "label1");

    expect(current).toStrictEqual(expected);
  });

  it("should add a new lable if the todo has the label but in another case", () => {
    const mockStore = createMockStore([
      { id: 2, title: "Todo 2", done: false, labels: ["label1"] },
    ]);

    const expected = {
      id: 2,
      title: "Todo 2",
      done: false,
      labels: ["label1", "Label1"],
    };

    const current = addLabel(mockStore, 2, "Label1");

    expect(current).toStrictEqual(expected);
  });
});
