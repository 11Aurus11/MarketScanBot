import 'dotenv/config';
import { Telegraf } from 'telegraf';
import parseProduct from './parser.js';

const bot = new Telegraf(process.env.BOT_TOKEN);
let isRunning = true;

const botCommand = [
    { command: '/help', description: 'Показать все команды' },
    { command: '/parse platform <ID>', description: 'Получить данные о товаре wb или ozon' },
    { command: '/clear', description: 'Очистить весь чат' },
];

function getProductData() {

    bot.command('start', ctx => {
        console.log('start');
        if (isRunning) {
            const helpMessage = botCommand.map(cmd => `${cmd.command} — ${cmd.description}`).join('\n');
            ctx.reply(`Привет! 👋\nОтправь ID товара Wildberries или Ozon.\n\nДоступные команды:\n${helpMessage}`);
        } else {
            ctx.reply('Бот уже запущен.');
        }
    });

    bot.command('stop', ctx => {
        console.log('stop');
            ctx.reply('Рад был помочь 🙂 Бот остановлен. Запустите код снова');
            bot.stop();
    });

    bot.command('help', ctx => {
        console.log('help');
        const message = botCommand.map(cmd => `${cmd.command} — ${cmd.description}`).join('\n');
        ctx.reply(message);
    });

    bot.command('parse', async (ctx) => {
        const messageText = ctx.message.text;
        const parts = messageText.split(' ');
        const platform = parts[1]
        const productId = parts[2];

        if(!platform || !productId) {
            ctx.reply('⚠️ Укажи платформу и ID товара. Пример: /parse wb 12345678 или /parse ozon 1748041794');
            return
        }

        ctx.reply(`🔍 Ищу данные для товара с ID: (${platform.toUpperCase()})...`)

        const data = await parseProduct(platform, productId)

        if(!data) {
            ctx.reply('❌ Не удалось получить данные. Проверь ID или платформу.')
            return
        }

        ctx.reply(`
    ✅ Найден товар:
    📦 Название: ${data.title}
    💰 Цена: ${data.price}
    📈 В наличии: ${data.inStock}
    🔗 Ссылка: ${data.url}
            `)
    });

    bot.command('clear', async (ctx) => {
        let i = 0;
        while(true) {
            try {
                await ctx.deleteMessage(ctx.message.message_id - i++);
            } catch(e) {
                break
            }
        }
    })

    bot.launch();
}

getProductData();