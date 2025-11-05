import startCommand from './start.js';
import stopCommand from './stop.js';
import helpCommand from './help.js';
import parseCommand from './parse.js';
import clearCommand from './clear.js';
import nullDBCommand from './nullDB.js';
import db from '../db.js';

const { addMessage } = db;

export default function setupCommands(bot) {
    const botCommand = [
        { command: '/help', description: 'Показать все команды' },
        { command: '/parse', description: 'Получить данные о товаре wb или ozon' },
        { command: '/clear', description: 'Очистить всё не связанное с ботом' },
        { command: '/nulldb', description: 'Очистить всю БД от ID сообщений' },
    ];

    bot.telegram.setMyCommands(botCommand);

    startCommand(bot, botCommand);
    stopCommand(bot);
    helpCommand(bot, botCommand);
    parseCommand(bot);
    clearCommand(bot);
    nullDBCommand(bot);

    // логика сохранения сообщений
    bot.on('message', (ctx) => {
        if (!ctx.message || ctx.message.from.is_bot) return; // пропускаем боты и пустые сообщения

        const userId = ctx.from.id;
        const messageId = ctx.message.message_id;

        if (!messageId) return; // если message_id нет, пропускаем

        addMessage(userId, messageId);
    });
}
