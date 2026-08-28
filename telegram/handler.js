const config = require("../config");

const ping = require("../commands/ping");
const menu = require("../commands/menu");
const help = require("../commands/help");
const alive = require("../commands/alive");
const info = require("../commands/info");

function registerTelegramHandlers(bot) {
  bot.command("ping", async (ctx) => {
    await ping.telegram(ctx);
  });

  bot.command("menu", async (ctx) => {
    await menu.telegram(ctx);
  });

  bot.command("help", async (ctx) => {
    await help.telegram(ctx);
  });

  bot.command("alive", async (ctx) => {
    await alive.telegram(ctx);
  });

  bot.command("info", async (ctx) => {
    await info.telegram(ctx);
  });

  bot.on("text", async (ctx) => {
    const text = ctx.message.text.trim().toLowerCase();

    if (text === "hi" || text === "hello" || text === "hey") {
      await ctx.reply(
        "Hey 👋 Main DEMON-BOT hoon. Kya help chahiye?"
      );
    }
  });
}

module.exports = {
  registerTelegramHandlers
};
