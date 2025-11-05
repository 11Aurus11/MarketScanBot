import 'dotenv/config';
import { Telegraf } from 'telegraf';
import setupCommands from './commands/index.js';
import logger from './middlewares/logger.js';

const bot = new Telegraf(process.env.BOT_TOKEN);

// middleware для логов
bot.use(logger);

// подключаем все команды
setupCommands(bot);

// глобальный обработчик ошибок
bot.catch((err, ctx) => {
  console.error(`Ошибка при обработке ${ctx.updateType}:`, err);
  ctx.reply('⚠️ Произошла ошибка. Попробуй позже.');
});

// запуск
bot.launch().then(() => console.log('🤖 Бот запущен успешно!'));

// корректная остановка
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
