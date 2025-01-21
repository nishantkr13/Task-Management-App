const taskForm = document.getElementById('task-form');
const taskList = document.getElementById('task-list');
const filterPriority = document.getElementById('filter-priority');
const filterStatus = document.getElementById('filter-status');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function renderTasks() {
    taskList.innerHTML = '';
    const filteredTasks = tasks.filter(task => {
        const priorityMatch = filterPriority.value === 'all' || task.priority === filterPriority.value;
        const statusMatch = filterStatus.value === 'all' || task.status === filterStatus.value;
        return priorityMatch && statusMatch;
    });

    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = task.status === 'completed' ? 'completed' : '';
        li.innerHTML = `
            <span>${task.name} - ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority (Due: ${task.dueDate || 'No date'})</span>
            <div class="task-actions">
                <button onclick="toggleTaskStatus('${task.id}')">${task.status === 'completed' ? 'Mark Pending' : 'Mark Completed'}</button>
                <button onclick="deleteTask('${task.id}')">Delete</button>
            </div>
        `;
        taskList.appendChild(li);
    });
}

function addTask(e) {
    e.preventDefault();

    const name = document.getElementById('task-name').value.trim();
    const priority = document.getElementById('task-priority').value;
    const dueDate = document.getElementById('task-due-date').value;

    if (!name) {
        alert('Task name cannot be empty.');
        return;
    }

    const newTask = {
        id: Date.now().toString(),
        name,
        priority,
        dueDate,
        status: 'pending'
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();
    taskForm.reset();
}

function toggleTaskStatus(id) {
    tasks = tasks.map(task => task.id === id ? { ...task, status: task.status === 'completed' ? 'pending' : 'completed' } : task);
    saveTasks();
    renderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

taskForm.addEventListener('submit', addTask);
filterPriority.addEventListener('change', renderTasks);
filterStatus.addEventListener('change', renderTasks);

renderTasks();
