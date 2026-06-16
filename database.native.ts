import * as SQLite from 'expo-sqlite';

export type Task = {
  id: number;
  title: string;
  created_at: string;
};

const db = SQLite.openDatabaseSync('todo-list.db');

export function initializeDatabase() {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

export function listTasks(): Task[] {
  return db.getAllSync<Task>(
    'SELECT id, title, created_at FROM tasks ORDER BY datetime(created_at) ASC, id ASC;'
  );
}

export function addTask(title: string) {
  db.runSync('INSERT INTO tasks (title, created_at) VALUES (?, ?);', [
    title,
    new Date().toISOString(),
  ]);
}

export function updateTask(id: number, title: string) {
  db.runSync('UPDATE tasks SET title = ? WHERE id = ?;', [title, id]);
}

export function deleteTask(id: number) {
  db.runSync('DELETE FROM tasks WHERE id = ?;', [id]);
}
