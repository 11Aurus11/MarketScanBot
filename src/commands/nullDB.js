import db from '../db.js';
const { getAllMessages, nullDB} = db;

export default (bot) => {
  bot.command('nulldb', async (ctx) => { // только латиница в команде
    const userId = ctx.from.id;
    const messages = getAllMessages(userId); // только свои сообщения

    for (const id of messages) {
      try {
        await ctx.deleteMessage(id);
      } catch (e) {
        console.log(`Ошибка при удалении ${id}: ${e.message}`);
      }
    }

    await nullDB(userId); // удаляем только свои ID
    const sent = await ctx.reply('ID БД очищен!');
    setTimeout(() => ctx.deleteMessage(sent.message_id).catch(() => {}), 1000);
  });
};
