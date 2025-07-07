// 待办事项功能
const todoListEl = document.getElementById('todo-list');
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');

let todos = JSON.parse(localStorage.getItem('miao_todos') || '[]');

function renderTodos() {
  todoListEl.innerHTML = '';
  todos.forEach((todo, idx) => {
    const item = document.createElement('div');
    item.className = 'todo-item' + (todo.completed ? ' completed' : '');
    item.innerHTML = `
      <span>${todo.text}</span>
      <div>
        <button class="complete-btn" title="完成">✔️</button>
        <button class="delete-btn" title="删除">🗑️</button>
      </div>
    `;
    item.querySelector('.complete-btn').onclick = () => {
      todos[idx].completed = !todos[idx].completed;
      saveTodos();
    };
    item.querySelector('.delete-btn').onclick = () => {
      todos.splice(idx, 1);
      saveTodos();
    };
    todoListEl.appendChild(item);
  });
}

function saveTodos() {
  localStorage.setItem('miao_todos', JSON.stringify(todos));
  renderTodos();
}

todoForm.onsubmit = function(e) {
  e.preventDefault();
  const text = todoInput.value.trim();
  if (text) {
    todos.unshift({ text, completed: false });
    saveTodos();
    todoInput.value = '';
  }
};

// 初始化
renderTodos();

// 时间规划区域后续补充 