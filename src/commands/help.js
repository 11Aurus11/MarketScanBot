export default (bot, botCommand) => {
  bot.command('help', async (ctx) => {
    const message = botCommand.map(cmd => `${cmd.command} — ${cmd.description}`).join('\n');
    await ctx.reply(message);
  });
};
