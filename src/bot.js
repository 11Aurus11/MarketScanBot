import 'dotenv/config';
import { Telegraf, Markup } from 'telegraf';
import parseProduct from './parser.js';
import db from './db.js'
import { message } from 'telegraf/filters';

const { addMessage, getAllMessages, clearDB, nullDB } = db;

const bot = new Telegraf(process.env.BOT_TOKEN);
let isRunning = true;

const botCommand = [
    { command: '/help', description: 'Показать все команды' },
    { command: '/parse platform <ID>', description: 'Получить данные о товаре wb или ozon' },
    { command: '/clear', description: 'Очистить весь чат' },
    { command: '/nullDB', description: 'Очистить весь БД от ID сообщений' },
];

function getProductData() {
    bot.use((ctx, next) => {
        console.log('Получено обновление:', ctx.updateType, ctx.update);
        return next();
    });

    // Команда /start
    bot.command('start', async (ctx) => {
        console.log('start');

        if (!isRunning) {
            await ctx.reply('Бот уже запущен.');
            return;
        }

        if (!Array.isArray(botCommand)) {
            console.log('botCommand не определён или не массив!');
            return;
        }
        
        const helpMessage = botCommand.map(cmd => `${cmd.command} — ${cmd.description}`).join('\n');
        const keyboard = Markup.keyboard([['Меню']]).resize().oneTime(false);

        try {
            await ctx.reply(
                `Привет! 👋\nОтправь ID товара Wildberries или Ozon.\n\nДоступные команды:\n${helpMessage}`,
                keyboard
            );
        } catch (e) {
            console.error('Ошибка при отправке сообщения:', e.message);
        }
    });


    // Команда Меню
    bot.command('Меню', (ctx) => {
        const menuText = botCommand.map(cmd => `${cmd.command} — ${cmd.description}`).join('\n');
        ctx.reply(menuText);
    });

    // Команда /stop
    bot.command('stop', ctx => {
        console.log('stop');
        ctx.reply('Рад был помочь 🙂 Бот остановлен. Запустите код снова');
        bot.stop();
    });

    // Команда /help
    bot.command('help', ctx => {
        console.log('help');
        const message = botCommand.map(cmd => `${cmd.command} — ${cmd.description}`).join('\n');
        ctx.reply(message);
    });

    // Команда /parse
    bot.command('parse', async (ctx) => {
        const messageText = ctx.message.text;
        const parts = messageText.split(' ');
        const platform = parts[1];
        const productId = parts[2];

        if(!platform || !productId) {
            ctx.reply('⚠️ Укажи платформу и ID товара. Пример: /parse wb 12345678 или /parse ozon 1748041794');
            return;
        }

        ctx.reply(`🔍 Ищу данные для товара с ID: (${platform.toUpperCase()})...`);

        const data = await parseProduct(platform, productId);

        if(!data) {
            ctx.reply('❌ Не удалось получить данные. Проверь ID или платформу.');
            return;
        }

        ctx.reply(`
    ✅ Найден товар:
    📦 Название: ${data.title}
    💰 Цена: ${data.price}
    📈 В наличии: ${data.inStock}
    🔗 Ссылка: ${data.url}
        `);
    });

    // Команда /clear
    bot.command('clear', async (ctx) => {
        // const messages = getAllMessages();
        // console.log('Сообщения из базы для удаления:', messages);

        // const deletePromisesDB = messages.map(async (id) => {
        //     try {
        //         await ctx.deleteMessage(id);
        //     } catch (e) {
        //         console.log(`Не удалось удалить сообщение ${id} из базы: ${e.message}`);
        //     }
        // });
        // await Promise.all(deletePromisesDB);

        // let i = 0;
        // while (true) {
        //     try {
        //         await ctx.deleteMessage(ctx.message.message_id - i++);
        //     } catch (e) {
        //         break;
        //     }
        // }

        // clearDB();

        // const sentMessage = await ctx.reply('Чат очищен!');
        // setTimeout(() => {
        //     ctx.deleteMessage(sentMessage.message_id).catch(e => {
        //         console.log('Не удалось удалить сообщение о очистке:', e.message);
        //     });
        // }, 1000);
        const messages = getAllMessages()
        console.log('Сообщения из базы для удаления:', messages)

        const deletePromisesDB = message.map(async (id) => {
            try {
                await ctx.deleteMessage()
            } catch {
                console.log(`Не удалось удалить сообщение ${id} из базы: ${e.message}`);
            }
        })
        await Promise.all(deletePromisesDB)

        let i = 0
        while(true) {
            try {
                await ctx.deleteMessage(ctx.message.message_id - i++)
            } catch(e) {
                break
            }
        }
        clearDB()
        const sentMessage = ctx.reply('Чат очищен!')
        setTimeout()
    });


    bot.command('nullDB', async (ctx) => {
        const messagesNull = getAllMessages();
        console.log(messagesNull);

        const deletePromisesID = messagesNull.map(async (id) => {
            try {
                await ctx.deleteMessage(id);
            } catch(e) {
                console.log(`Не удалось удалить id сообщений ${id}: ${e.message}`);
            }
        });

        await Promise.all(deletePromisesID); // сначала удаляем сообщения

        const sentMessage = await ctx.reply('ID БД очищен!');
        setTimeout(() => {
            ctx.deleteMessage(sentMessage.message_id).catch(e => {
                console.log('Не удалось удалить сообщение о очистке:', e.message);
            });
        }, 1000);
    });

        // Сохраняем все сообщения
    bot.on('message', (ctx) => {
        if(ctx.message.from.is_bot) return;
        addMessage(ctx.message.message_id);
    });

    // Запуск бота
    bot.launch().then(() => console.log('Бот запущен ✅'));
}

getProductData();