
require("dotenv").config();

module.exports = {
  botName: process.env.BOT_NAME || "DEMON-BOT",
  prefix: process.env.PREFIX || ".",

  ownerNumber: process.env.OWNER_NUMBER || "",

  telegramToken: process.env.TELEGRAM_TOKEN || "",

  sessionDir: process.env.SESSION_DIR || "./session",

  autoReply: process.env.AUTO_REPLY !== "false",

  welcome: process.env.WELCOME !== "false",

  cooldownMs: Number(process.env.COOLDOWN_MS || 3000)
};
