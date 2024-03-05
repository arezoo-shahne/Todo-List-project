// let todos = [];
let filterValue = "All";
const inputBox = document.querySelector(".input-box");
const todoForm = document.querySelector(".todo-form");
const todoList = document.querySelector(".todo-items");
const select = document.querySelector(".filters");

todoForm.addEventListener("submit", addNewTodo);

document.addEventListener("DOMContentLoaded", (e) => {
  const todos = getAllTodos();
  createTodos(todos);
});
function addNewTodo(e) {
  e.preventDefault();

  if (!inputBox.value) return null;

  const newTodo = {
    id: Date.now(),
    createAt: new Date().toISOString(),
    title: inputBox.value,
    isCompleted: false,
  };
  // todos.push(newTodo);
  savedTodos(newTodo);
  filterTodos();
}
function createTodos(todos) {
  let result = "";
  todos.forEach((item) => {
    result += `<li class="todo">
    <p class="todo-title primary-title ${item.isCompleted && "completed"}">${
      item.title
    }</p>
    <span class="todo-dateCreated">${new Date(item.createAt).toLocaleDateString(
      "fa-IR"
    )}</span>
    <button data-todo-id=${
      item.id
    } class="edited"><i class="fa fa-edit"></i></button>
    <button data-todo-id=${
      item.id
    } class="checked"><i class="fa fa-check"></i></button>
    <button data-todo-id=${
      item.id
    } class="deleted"><i class="fa fa-trash"></i></button>
</li>`;
  });

  todoList.innerHTML = result;
  inputBox.value = "";
  const deleteTodoBtn = [...document.querySelectorAll(".deleted")];
  deleteTodoBtn.forEach((item) => item.addEventListener("click", deleteTodo));

  const checkTodoBtn = [...document.querySelectorAll(".checked")];
  checkTodoBtn.forEach((item) => item.addEventListener("click", checkTodo));

  const editButtons = [...document.querySelectorAll(".edited")];
  editButtons.forEach((button) => {
    button.addEventListener("click", openEditBackdrop);
  });
}

//********  Select Filter   ***********

select.addEventListener("change", (e) => {
  filterValue = e.target.value;
  filterTodos();
});

function filterTodos() {
  const todos = getAllTodos();
  switch (filterValue) {
    case "All": {
      createTodos(todos);
      break;
    }
    case "Completed": {
      const filteredTodos = todos.filter((item) => item.isCompleted);
      createTodos(filteredTodos);
      break;
    }
    case "Un-Completed": {
      const filteredTodos = todos.filter((item) => !item.isCompleted);
      createTodos(filteredTodos);
      break;
    }
    default:
      createTodos(todos);
  }
}

function openEditBackdrop(e) {
  let todos = getAllTodos();
  const todoId = Number(e.target.dataset.todoId);
  const newTodo = todos.find((item) => item.id === todoId);
  const backdrop = document.querySelector(".backdrop");
  const editForm = document.querySelector(".edit-input-box");
  const editInputBox = document.querySelector(".edit-input");
  backdrop.style.display = "flex";
  editForm.style.display = "flex";
  editForm.addEventListener("submit", updateNewTitle);

  function updateNewTitle() {
    newTitle = editInputBox.value;
    newTodo.title = newTitle;
    saveAllTodos(todos);
    filterTodos();
  }
}

// **************** delete todo  ***************

function deleteTodo(e) {
  let todos = getAllTodos();
  const todoId = Number(e.target.dataset.todoId);
  todos = todos.filter((item) => item.id !== todoId);
  saveAllTodos(todos);
  filterTodos();
  // createTodos(todos);
}

// ***********todo check*************

function checkTodo(e) {
  let todos = getAllTodos();
  const todoId = Number(e.target.dataset.todoId);
  const newTodo = todos.find((item) => item.id === todoId);
  console.log(newTodo);
  newTodo.isCompleted = !newTodo.isCompleted;
  saveAllTodos(todos);
  filterTodos();
}

function sortTodos(todos) {
  return [...todos].sort((a, b) => {
    const dateA = new Date(a.createAt).getTime();
    const dateB = new Date(b.createAt).getTime();
    return dateB - dateA;
  });
}
function getAllTodos() {
  const savedTodos = JSON.parse(localStorage.getItem("todos")) || [];
  console.log(sortTodos(savedTodos));
  return sortTodos(savedTodos);
}

function savedTodos(todo) {
  const savedTodos = getAllTodos();
  savedTodos.push(todo);
  localStorage.setItem("todos", JSON.stringify(savedTodos));
  return savedTodos;
}
function saveAllTodos(todos) {
  localStorage.setItem("todos", JSON.stringify(todos));
}
