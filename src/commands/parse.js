import parseProduct from '../parser.js';

export default (bot) => {
  bot.command('parse', async (ctx) => {
    const parts = ctx.message.text.split(' ');
    const platform = parts[1];
    const productId = parts[2];

    if (!platform || !productId) {
      return ctx.reply('⚠️ Укажи платформу и ID товара. Пример: /parse wb 12345678 или /parse ozon 1748041794');
    }

    await ctx.reply(`🔍 Ищу данные для товара (${platform.toUpperCase()})...`);

    try {
      const data = await parseProduct(platform, productId);

      if (!data) {
        return ctx.reply('❌ Не удалось получить данные. Проверь ID или платформу.');
      }

      await ctx.reply(`
✅ Найден товар:
📦 Название: ${data.title}
💰 Цена: ${data.price}
📈 В наличии: ${data.inStock}
🔗 Ссылка: ${data.url}
      `);
    } catch (e) {
      console.error('Ошибка при парсинге:', e.message);
      ctx.reply('⚠️ Произошла ошибка при получении данных.');
    }
  });
};
