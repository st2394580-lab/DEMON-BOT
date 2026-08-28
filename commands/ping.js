module.exports = async function ping({
  sock,
  jid,
  message
}) {
  const start = Date.now();

  const sent = await sock.sendMessage(
    jid,
    { text: "🏓 Pinging..." },
    { quoted: message }
  );

  const speed = Date.now() - start;

  await sock.sendMessage(
    jid,
    {
      text: `🏓 *PONG!*\n\n⚡ Speed: ${speed} ms`
    },
    { quoted: sent }
  );
};

module.exports.telegram = async function telegramPing(ctx) {
  const start = Date.now();

  const sent = await ctx.reply("🏓 Pinging...");

  const speed = Date.now() - start;

  await ctx.reply(
    `🏓 PONG!\n\n⚡ Speed: ${speed} ms`
  );
};
