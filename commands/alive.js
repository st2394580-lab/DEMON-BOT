const config = require("../config");

module.exports = async function alive({
  sock,
  jid,
  message
}) {
  await sock.sendMessage(
    jid,
    {
      text: `👹 *${config.botName}*\n\n✅ Bot is alive!\n⚡ Status: Online`
    },
    { quoted: message }
  );
};

module.exports.telegram = async function telegramAlive(ctx) {
  await ctx.reply(
    `👹 ${config.botName}\n\n✅ Bot is alive!\n⚡ Status: Online`
  );
};
