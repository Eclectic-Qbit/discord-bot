async function connectDiscord(discordBot) {
  const start = Date.now();
  await discordBot.login(process.env.BOT_SECRET);
  console.log(`Connected to discord in ${Date.now() - start}ms`);
}
module.exports = { connectDiscord };
