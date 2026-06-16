export type Task = {
  id: number;
  title: string;
  created_at: string;
};

const STORAGE_KEY = 'atividade_to_do_list_tasks';

function readTasks(): Task[] {
  const storedTasks = globalThis.localStorage?.getItem(STORAGE_KEY);

  if (!storedTasks) {
    return [];
  }

  return JSON.parse(storedTasks) as Task[];
}

function saveTasks(tasks: Task[]) {
  globalThis.localStorage?.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

export function initializeDatabase() {
  if (!globalThis.localStorage?.getItem(STORAGE_KEY)) {
    saveTasks([]);
  }
}

export function listTasks(): Task[] {
  return readTasks().sort((firstTask, secondTask) => {
    const firstDate = new Date(firstTask.created_at).getTime();
    const secondDate = new Date(secondTask.created_at).getTime();

    return firstDate - secondDate || firstTask.id - secondTask.id;
  });
}

export function addTask(title: string) {
  const tasks = readTasks();
  const nextId = tasks.length === 0 ? 1 : Math.max(...tasks.map((task) => task.id)) + 1;

  saveTasks([
    ...tasks,
    {
      id: nextId,
      title,
      created_at: new Date().toISOString(),
    },
  ]);
}

export function updateTask(id: number, title: string) {
  saveTasks(readTasks().map((task) => (task.id === id ? { ...task, title } : task)));
}

export function deleteTask(id: number) {
  saveTasks(readTasks().filter((task) => task.id !== id));
}
