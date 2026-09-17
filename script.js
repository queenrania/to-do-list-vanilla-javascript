const todoFormEl = document.querySelector("#todo-form");
const todoInputEl = document.querySelector("#todo-input");
const todoListEl = document.querySelector("#todo-list");
const errorMessageEl = document.querySelector("#error-message");
const todoCountEl = document.querySelector("#todo-count");
const filterButtons = document.querySelectorAll(".filter-button");
const clearCompletedBtn = document.querySelector("#clear-completed");

let todos = [];
let currentFilter = "all";

function loadTodos() {
  const savedTodos = localStorage.getItem("todos");

  if (savedTodos) {
    try {
      todos = JSON.parse(savedTodos);
    } catch (error) {
      todos = [];
      console.error("Could not load saved todos:", error);
    }
  }
}

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function showError(message) {
  errorMessageEl.textContent = message;
  errorMessageEl.classList.add("show");
}

function clearError() {
  errorMessageEl.textContent = "";
  errorMessageEl.classList.remove("show");
}

function addTodo(text) {
  const trimmedText = text.trim();

  if (trimmedText.length === 0) {
    showError("Please enter a todo.");
    return;
  }

  if (trimmedText.length < 3) {
    showError("Todo must be at least 3 characters long.");
    return;
  }

  const newTodo = {
    id: Date.now().toString(),
    text: trimmedText,
    completed: false,
    createdAt: new Date().toISOString(),
  };

  todos.push(newTodo);

  // Save the updated todo list, then refresh the display
  saveTodos();
  renderTodos();

  todoInputEl.value = "";
  clearError();
  todoInputEl.focus();
}

function toggleTodo(todoId) {
  todos = todos.map((todo) => {
    if (todo.id === todoId) {
      return {
        ...todo,
        completed: !todo.completed,
      };
    }

    return todo;
  });

  saveTodos();
  renderTodos();
}

function deleteTodo(todoId) {
  todos = todos.filter((todo) => todo.id !== todoId);

  saveTodos();
  renderTodos();
}

function clearCompletedTodos() {
  todos = todos.filter((todo) => !todo.completed);

  saveTodos();
  renderTodos();
}

function getFilteredTodos() {
  if (currentFilter === "active") {
    return todos.filter((todo) => !todo.completed);
  }

  if (currentFilter === "completed") {
    return todos.filter((todo) => todo.completed);
  }

  return todos;
}

function updateTodoCount() {
  const remainingTodos = todos.filter((todo) => !todo.completed).length;

  todoCountEl.textContent = `${remainingTodos} of ${todos.length} items remaining`;
}

function renderTodos() {
  todoListEl.innerHTML = "";

  const filteredTodos = getFilteredTodos();

  if (filteredTodos.length === 0) {
    const emptyMessage = document.createElement("li");
    emptyMessage.classList.add("empty-state");

    if (todos.length === 0) {
      emptyMessage.textContent = "No todos yet. Add one above!";
    } else if (currentFilter === "active") {
      emptyMessage.textContent = "No active todos.";
    } else if (currentFilter === "completed") {
      emptyMessage.textContent = "No completed todos.";
    }

    todoListEl.appendChild(emptyMessage);
    updateTodoCount();
    return;
  }

  filteredTodos.forEach((todo) => {
    const todoItem = document.createElement("li");
    todoItem.classList.add("item");

    if (todo.completed) {
      todoItem.classList.add("completed");
    }

    todoItem.dataset.id = todo.id;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("checkbox");
    checkbox.checked = todo.completed;
    checkbox.setAttribute("aria-label", `Complete ${todo.text}`);

    const todoText = document.createElement("span");
    todoText.classList.add("text");
    todoText.textContent = todo.text;

    const actions = document.createElement("div");
    actions.classList.add("actions");

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button");
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.setAttribute("aria-label", `Delete ${todo.text}`);

    actions.appendChild(deleteButton);

    todoItem.appendChild(checkbox);
    todoItem.appendChild(todoText);
    todoItem.appendChild(actions);

    todoListEl.appendChild(todoItem);
  });

  updateTodoCount();
}

todoFormEl.addEventListener("submit", (event) => {
  event.preventDefault();

  addTodo(todoInputEl.value);
});

// Use event delegation because todo list items are created dynamically
todoListEl.addEventListener("change", (event) => {
  if (event.target.classList.contains("checkbox")) {
    const todoItem = event.target.closest(".item");
    const todoId = todoItem.dataset.id;

    toggleTodo(todoId);
  }
});

todoListEl.addEventListener("click", (event) => {
  if (event.target.classList.contains("delete-button")) {
    const todoItem = event.target.closest(".item");
    const todoId = todoItem.dataset.id;

    deleteTodo(todoId);
  }
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;

    filterButtons.forEach((filterButton) => {
      const isActive = filterButton === button;

      filterButton.classList.toggle("active", isActive);
      filterButton.setAttribute("aria-pressed", isActive);
    });

    renderTodos();
  });
});

clearCompletedBtn.addEventListener("click", clearCompletedTodos);

loadTodos();
renderTodos();
