export default (bot, botCommand) => {
  bot.command('start', async (ctx) => {
    // Формируем список команд
    const helpMessage = botCommand
      .map(cmd => `/${cmd.command} — ${cmd.description}`)
      .join('\n');

    await ctx.reply(
      `Привет! 👋\nОтправь ID товара Wildberries или Ozon.`
    );
  });
};
