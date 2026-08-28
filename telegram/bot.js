const { Telegraf } = require("telegraf");

const config = require("../config");
const handler = require("./handler");
const logger = require("../utils/logger");

let bot = null;

async function startTelegram() {
  if (!config.telegramToken) {
    logger.warn("TELEGRAM_TOKEN not configured. Telegram disabled.");
    return null;
  }

  bot = new Telegraf(config.telegramToken);

  handler.registerTelegramHandlers(bot);

  await bot.launch();

  logger.success("Telegram bot started.");

  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("SIGTERM", () => bot.stop("SIGTERM"));

  return bot;
}

function getTelegramBot() {
  return bot;
}

module.exports = {
  startTelegram,
  getTelegramBot
};
