console.log("starting test");
import todoService from "./service/todoService.mjs";

console.log("Starting application...");

let appState = new Map();


function onEnter(action) {
    const ev = window.event;
    if (ev.keyCode === 13 && !ev.shiftKey) {
        ev.preventDefault();
        action();
    }
}
window.onEnter = onEnter;

async function displayLogin() {
    let contentEl = document.querySelector(".page-content");
    let html = "";
    html+=`
<div class="login-view">
    <h1 class="content-heading">Login</h1>
    <hr/>
    <label class="field-labels"><br>
        <input id="username-input" type="text" onkeypress="onEnter(login)"></br>
        <button type="button" onclick="login()"/>Login</button>
    </label>
</div>
`.trimStart();
    contentEl.innerHTML = html;
    let usernameInputEl = document.querySelector("#username-input");
    usernameInputEl.focus();
}
window.displayLogin = displayLogin;


async function login() {
    let usernameInputEl = document.querySelector("#username-input");
    let username = usernameInputEl.value;
    const user = await todoService.login(username);
    appState.set("user", user);
    displayTodos();
}
window.login = login;


async function displayTodos() {
    const user = appState.get("user");
    const todos = await todoService.getTodos(user.id);
    appState.set("todos", todos);

    let contentEl = document.querySelector(".page-content");
    let html = "";
    html+=`
<div class="todo-view">
    <button type="button" class="todo-opt-btn logout-btn" onclick="displayLogin()"/>Logout</button>
    <h1 class="content-heading">To Do Items:</h1>
    <hr/>
`.trimStart();
    let todoEntries = Object.entries(appState.get("todos"));
    if (todoEntries.length === 0) {
        html+= `<span class="todo-label">No To Do Items Found</span>`;
    }
    else {
        todoEntries.forEach(([todoId, todo]) => {
            html+= `
        <div class="todo" data-todo-id="${todoId}">
            <button type="button" class="todo-opt-btn del" onclick="deleteTodo()"/>X</button>
            <input class="todo-checkbox" type="checkbox" onchange="editTodo()" ${todo.completed ? "checked" : ""}/>
            <span class="todo-text" contenteditable onkeypress="onEnter(editTodo)" onblur="editTodo()">${todo.text}</span>
        </div>
    `.trimStart();
        });
    }
    html+= `
    <hr/>
    <label class="todo-label">Add a To Do:</br>
        <textarea id="add-todo-textarea" onkeypress="onEnter(addTodo)"></textarea>
    </label>
    <button type="button" class="todo-opt-btn" onclick="addTodo()"/>Add a To Do</button>
`.trimStart();
    contentEl.innerHTML = html;
    document.querySelector("#add-todo-textarea").focus();
}
window.displayTodos = displayTodos;


async function addTodo() {
    let user = appState.get("user");
    let todoText = document.querySelector("#add-todo-textarea").value;
    await todoService.addTodo(user.id, {
        text: todoText,
        completed: false,
    });
    displayTodos();
}
window.addTodo = addTodo;


async function editTodo() {
    let user = appState.get("user");
    const ev = window.event;
    const targetEl = ev.target;
    const parentEl = targetEl.parentElement;
    const todoId = parentEl.getAttribute("data-todo-id");
    const currentTodo = appState.get("todos")[todoId];
    const todoTextEl = document.querySelector(`div[data-todo-id="${todoId}"] .todo-text`);
    const todoText = todoTextEl.innerText;
    if (!todoText.trim()) {
        todoTextEl.innerText = currentTodo.text;
        return;
    }
    const todoComplete = document.querySelector(`div[data-todo-id="${todoId}"] .todo-checkbox`).checked;
    const newTodo = {
        id: todoId,
        text: todoText,
        completed: todoComplete,
    };
    if (newTodo.text !== currentTodo.text || newTodo.completed !== currentTodo.completed) {
        await todoService.editTodo(user.id, todoId, newTodo);
        displayTodos();
    }
}
window.editTodo = editTodo;


async function deleteTodo() {
    let user = appState.get("user");
    const ev = window.event;
    const targetEl = ev.target;
    const parentEl = targetEl.parentElement;
    const todoId = parentEl.getAttribute("data-todo-id");
    await todoService.deleteTodo(user.id, todoId);
    displayTodos();
}
window.deleteTodo = deleteTodo;



displayLogin();