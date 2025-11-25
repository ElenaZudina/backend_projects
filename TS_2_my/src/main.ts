// Главный модуль приложения
// Здесь инициализируется состояние, навешиваем событие и запускаем рендер

import type { Task, Status } from './types';
// ВАЖНО: в импортах указываем суффикс .js, чтобы браузер ESM
// корректно находил скомпиллированные файлы в dist/ без бандлера
import { loadTasks, saveTasks, generateId } from './storage.js';
import { renderBoard, bindDragAndDrop } from './ui.js';

// Нахождение элементов интерфейса
const form = document.getElementById('new-task-form') as HTMLFormElement;
const titleInput = document.getElementById('task-title') as HTMLInputElement;

// Колонки (элементы, куда помещаются карточки)
const colTodo = document.getElementById('col-todo') as HTMLElement;
const colWip = document.getElementById('col-wip') as HTMLElement;
const colDone = document.getElementById('col-done') as HTMLElement;
const colTest =  document.getElementById('col-test') as HTMLElement;

// Сопоставляем статус -> элемент колонки
const columns: Record<Status, HTMLElement> = {
    todo: colTodo,
    wip: colWip,
    test: colTest,
    done: colDone
};

// Локальное состояние задач (загружаем из localStorage при старте)
let tasks: Task[] = loadTasks().map(task => ({
    ...task,
    priority: task.priority || 'medium'
}));

// Утилита перерендера и сохранения
function sync() {
    renderBoard(tasks, columns);
    saveTasks(tasks);
}

// Обаработка создания новой задачи
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = titleInput.value.trim();
    if (!title) return;

    const prioritySelect = document.getElementById('task-priority') as HTMLSelectElement;
    const priority = prioritySelect.value as 'low' | 'medium' | 'high';

    // Создаем новую задачу: дата становится автоматичеки текущей
    const newTask: Task = {
        id: generateId(),
        title,
        createdAt: new Date().toISOString(),
        status: 'todo',
        priority
    };

    tasks = [newTask, ...tasks];
    titleInput.value = '';
    sync();
});

// Функция перемещения задачи между колонками
function moveTask(taskId: string, to: Status) {
    const idx = tasks.findIndex((t) => t.id === taskId);
    if (idx === -1) return;
    // Если переносим в Done - обновляем дату на текущую
    const updatedAt = (to === 'done' ) ? new Date().toISOString() : tasks[idx].createdAt;
    // Обновляем статус и сохраняем
    tasks[idx] = { ...tasks[idx], status: to, createdAt: updatedAt }; // обновляем
    sync();
    // Если задача перемещена в колонку Done - подсвети ее карточку на 1 секунду
    if (to === 'done') {
        const el = columns.done.querySelector(`[data-id="${taskId}"]`) as HTMLElement || null;
        if (el) {
            el.classList.add('flash-done');
            setTimeout(() => el.classList.remove('flash-done'), 1000);
        }
    }
}

// Привязка Drag & Drop
bindDragAndDrop(columns, moveTask);

// Первый рендер на старте
sync();

// Удаление задачи по клику на кнопку удаления
// Делегируемна весь документ, т. к. карточки динамические
document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement | null;
    if (!target) return;
    const delBtn = target.closest('.card-delete') as HTMLElement || null;
    if (!delBtn) return;
    e.preventDefault();
    e.stopPropagation();
    const card = delBtn.closest('.card') as HTMLElement || null;
    const id = card?.dataset.id;
    if (!id) return;
    // Фактическое удаление и синхронизация
    tasks = tasks.filter((t) => t.id !== id);
    sync();
});