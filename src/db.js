const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'messages.db'));

// Создаём таблицу, если её нет
db.prepare(`
    CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT
    )
`).run();

// Добавляем сообщение
function addMessage(id) {
    const stmt = db.prepare('INSERT INTO messages (id) VALUES (?)');
    stmt.run(id);
    console.log(stmt)
}

// Получаем все сообщения
function getAllMessages() {
    const stmt = db.prepare('SELECT id FROM messages');
    return stmt.all().map(row => row.id);
}

// Очищаем базу
function clearDB() {
    db.prepare('DELETE FROM messages').run();
}

function nullDB() {
    db.prepare('DELETE FROM sqlite_sequence WHERE name="messages"').run();
}

module.exports = { addMessage, getAllMessages, clearDB, nullDB };
