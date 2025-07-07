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
      catClapOnComplete();
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
    catHappyOnAdd();
  }
};

// 初始化
renderTodos();

// 时间规划区域后续补充 

// 番茄时钟功能
const pomodoroTimeEl = document.getElementById('pomodoro-time');
const pomodoroLabelEl = document.getElementById('pomodoro-label');
const startBtn = document.getElementById('pomodoro-start');
const pauseBtn = document.getElementById('pomodoro-pause');
const resetBtn = document.getElementById('pomodoro-reset');

let workDuration = 25 * 60; // 25分钟
let restDuration = 5 * 60;  // 5分钟
let timer = null;
let timeLeft = workDuration;
let isWork = true;
let isRunning = false;

function updatePomodoroDisplay() {
  const min = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const sec = String(timeLeft % 60).padStart(2, '0');
  pomodoroTimeEl.textContent = `${min}:${sec}`;
  pomodoroLabelEl.textContent = isWork ? '专注中' : '休息中';
  setCatFace(isWork ? 'focus' : 'rest');
}

function startPomodoro() {
  if (isRunning) return;
  isRunning = true;
  timer = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      updatePomodoroDisplay();
    } else {
      clearInterval(timer);
      isRunning = false;
      // 切换工作/休息
      isWork = !isWork;
      timeLeft = isWork ? workDuration : restDuration;
      updatePomodoroDisplay();
      setCatFace('celebrate');
      setTimeout(() => setCatFace(isWork ? 'focus' : 'rest'), 2000);
    }
  }, 1000);
  setCatFace('focus');
}

function pausePomodoro() {
  if (timer) clearInterval(timer);
  isRunning = false;
  setCatFace('idle');
}

function resetPomodoro() {
  if (timer) clearInterval(timer);
  isRunning = false;
  timeLeft = isWork ? workDuration : restDuration;
  updatePomodoroDisplay();
  setCatFace('idle');
}

startBtn.onclick = startPomodoro;
pauseBtn.onclick = pausePomodoro;
resetBtn.onclick = resetPomodoro;

updatePomodoroDisplay();

// 猫咪互动动画
const catFace = document.getElementById('cat-face');
const catMouth = document.getElementById('cat-mouth');
const catSvg = document.getElementById('cat-svg');
const catMenu = document.getElementById('cat-menu');
const catWidget = document.getElementById('cat-widget');
const catScratch = document.getElementById('cat-scratch');

// 猫抓SVG内容
const scratchSVG = `
<svg class="cat-scratch-svg" viewBox="0 0 60 40">
  <path d="M10 10 Q15 25 10 35" stroke="#ffb6b9" stroke-width="4" fill="none" stroke-linecap="round"/>
  <path d="M25 8 Q30 23 25 33" stroke="#ffb6b9" stroke-width="4" fill="none" stroke-linecap="round"/>
  <path d="M40 10 Q45 25 40 35" stroke="#ffb6b9" stroke-width="4" fill="none" stroke-linecap="round"/>
  <path d="M53 13 Q55 28 50 36" stroke="#ffb6b9" stroke-width="3" fill="none" stroke-linecap="round"/>
</svg>
`;
catScratch.innerHTML = scratchSVG;

function setCatFace(state) {
  // 状态: idle(默认), focus(专注), rest(休息), celebrate(庆祝), happy(添加任务), clap(完成任务)
  if (!catFace || !catMouth) return;
  switch(state) {
    case 'focus':
      catFace.setAttribute('fill', '#fff');
      catMouth.setAttribute('rx', '2');
      catMouth.setAttribute('ry', '1');
      break;
    case 'rest':
      catFace.setAttribute('fill', '#fff8f0');
      catMouth.setAttribute('rx', '4');
      catMouth.setAttribute('ry', '2');
      break;
    case 'celebrate':
      catFace.setAttribute('fill', '#ffe066');
      catMouth.setAttribute('rx', '5');
      catMouth.setAttribute('ry', '3');
      break;
    case 'happy':
      catFace.setAttribute('fill', '#fff');
      catMouth.setAttribute('rx', '4');
      catMouth.setAttribute('ry', '2');
      break;
    case 'clap':
      catFace.setAttribute('fill', '#fff');
      catMouth.setAttribute('rx', '3');
      catMouth.setAttribute('ry', '1.5');
      break;
    default:
      catFace.setAttribute('fill', '#fff');
      catMouth.setAttribute('rx', '4');
      catMouth.setAttribute('ry', '2');
  }
}

// 点击SVG小猫弹出菜单、切换表情、猫抓特效
catSvg.addEventListener('click', (e) => {
  e.stopPropagation();
  // 猫抓特效
  catScratch.classList.remove('active');
  void catScratch.offsetWidth; // 触发重绘
  catScratch.classList.add('active');
  // 菜单弹出
  if (catMenu.style.display === 'none') {
    catMenu.style.display = 'block';
  } else {
    catMenu.style.display = 'none';
  }
  // 表情彩蛋
  setCatFace('celebrate');
  setTimeout(() => setCatFace('idle'), 1200);
});
// 猫抓特效动画结束后隐藏
catScratch.addEventListener('animationend', () => {
  catScratch.classList.remove('active');
});

// 点击菜单项切换专注时长
catMenu.addEventListener('click', (e) => {
  if (e.target.classList.contains('cat-menu-item')) {
    const min = parseInt(e.target.getAttribute('data-minutes'));
    workDuration = min * 60;
    if (isWork) {
      timeLeft = workDuration;
      updatePomodoroDisplay();
    }
    catMenu.style.display = 'none';
    setCatFace('celebrate');
    setTimeout(() => setCatFace('idle'), 1200);
  }
  e.stopPropagation();
});

// 点击其他区域关闭菜单
window.addEventListener('click', (e) => {
  if (catMenu.style.display === 'block') {
    catMenu.style.display = 'none';
  }
});

// 防止菜单点击冒泡到window
catMenu.addEventListener('click', (e) => {
  e.stopPropagation();
});

// 任务操作时猫咪表情联动
function catHappyOnAdd() {
  setCatFace('happy');
  setTimeout(() => setCatFace('idle'), 1200);
}
function catClapOnComplete() {
  setCatFace('clap');
  setTimeout(() => setCatFace('idle'), 1200);
} 