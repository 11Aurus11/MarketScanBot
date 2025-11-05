import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database(path.join(__dirname, 'messages.db'));

// Удаляем старую таблицу
db.prepare('DROP TABLE IF EXISTS messages').run();

// Создаем новую таблицу
db.prepare(`
  CREATE TABLE messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    message_id INTEGER NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`).run();


// Добавляем сообщение
export function addMessage(user_id, message_id) {
  try {
    const stmt = db.prepare('INSERT INTO messages (user_id, message_id) VALUES (?, ?)');
    stmt.run(user_id, message_id);
  } catch (err) {
    console.error('Ошибка при добавлении сообщения:', err.message);
  }
}

// получаем все сообщения
export function getAllMessages(user_id) {
  try {
    const stmt = db.prepare('SELECT message_id FROM messages WHERE user_id = ?');
    return stmt.all(user_id).map(row => row.message_id);
  } catch (err) {
    console.error('Ошибка при чтении из БД:', err.message);
    return [];
  }
}

// очищаем бд
export function clearDB(user_id) {
  try {
    db.prepare('DELETE FROM messages WHERE user_id = ?').run(user_id);
  } catch (err) {
    console.error('Ошибка при очистке БД для пользователя:', err.message);
  }
}

// Обнуляем автоинкремент
export function nullDB() {
  try {
    db.prepare("DELETE FROM sqlite_sequence WHERE name='messages'").run();
  } catch (err) {
    console.error('Ошибка при сбросе счётчика ID:', err.message);
  }
}

export default { addMessage, getAllMessages, clearDB, nullDB };
