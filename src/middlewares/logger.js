export default (ctx, next) => {
  console.log(`📩 [${ctx.updateType}] Получено обновление`);
  return next();
};
