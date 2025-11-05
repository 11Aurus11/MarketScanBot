import db from '../db.js';
const { getAllMessages, clearDB } = db;

export default (bot) => {
  bot.command('clear', async (ctx) => {
    const userId = ctx.from.id;
    const messages = getAllMessages(userId); // только свои сообщения (бота)

    if (!messages.length) return ctx.reply('Нет сообщений для удаления.');

    for (const id of messages) {
      try { await ctx.deleteMessage(id); } 
      catch (e) { console.log(`Не удалось удалить сообщение ${id}: ${e.message}`); }
    }

    await clearDB(userId);

    const sent = await ctx.reply('Чат очищен!');
    setTimeout(() => ctx.deleteMessage(sent.message_id).catch(() => {}), 1000);
  });
};
