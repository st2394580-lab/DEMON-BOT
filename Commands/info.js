const config = require("../config");

module.exports = async function info({
  sock,
  jid,
  message
}) {
  const text = `
👹 *${config.botName}*

⚙️ Version: 1.0.0
📱 Platform: WhatsApp
🧩 System: Modular
⚡ Prefix: ${config.prefix}

Status: Online ✅
`;

  await sock.sendMessage(
    jid,
    { text },
    { quoted: message }
  );
};

module.exports.telegram = async function telegramInfo(ctx) {
  await ctx.reply(`
👹 ${config.botName}

⚙️ Version: 1.0.0
📱 Platform: Telegram
🧩 System: Modular
⚡ Commands: /menu

Status: Online ✅
`);
};
