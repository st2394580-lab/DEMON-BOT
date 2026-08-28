const config = require("../config");

const menuText = `
╭━━━〔 👹 DEMON-BOT 〕━━━╮

⚡ GENERAL
${config.prefix}ping
${config.prefix}alive
${config.prefix}info
${config.prefix}help
${config.prefix}menu

👥 GROUP
${config.prefix}groupinfo
${config.prefix}setname <name>
${config.prefix}welcome on
${config.prefix}welcome off

🛡️ ADMIN
${config.prefix}kick
${config.prefix}add
${config.prefix}promote
${config.prefix}demote

🤖 AUTO REPLY
Hi
Hello
Hey
Good morning
Good night

╰━━━━━━━━━━━━━━━━━━━━╯
`;

module.exports = async function menu({
  sock,
  jid,
  message
}) {
  await sock.sendMessage(
    jid,
    { text: menuText },
    { quoted: message }
  );
};

module.exports.telegram = async function telegramMenu(ctx) {
  await ctx.reply(
    menuText.replaceAll(config.prefix, "/")
  );
};
