const config = require("../config");

module.exports = async function help({
  sock,
  jid,
  message
}) {
  const text = `
🆘 *DEMON-BOT HELP*

Command format:

${config.prefix}command

Example:

${config.prefix}ping
${config.prefix}menu
${config.prefix}alive
${config.prefix}info

For group commands:

${config.prefix}groupinfo
${config.prefix}setname New Name

Use ${config.prefix}menu to see all commands.
`;

  await sock.sendMessage(
    jid,
    { text },
    { quoted: message }
  );
};

module.exports.telegram = async function telegramHelp(ctx) {
  await ctx.reply(`
🆘 DEMON-BOT HELP

/ping
/menu
/alive
/info

Use /menu for the complete command list.
`);
};
