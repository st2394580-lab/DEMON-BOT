const { startWhatsApp } =
  require("./whatsapp/connection");

const { registerWhatsAppHandler } =
  require("./whatsapp/handler");

const { startTelegram } =
  require("./telegram/bot");

const logger = require("./utils/logger");

async function start() {
  try {
    logger.info("Starting DEMON-BOT...");

    const sock = await startWhatsApp();

    registerWhatsAppHandler(sock);

    await startTelegram();

    logger.success("DEMON-BOT started successfully.");
  } catch (error) {
    logger.error(error.message);

    setTimeout(start, 5000);
  }
}

process.on("uncaughtException", (error) => {
  logger.error(`Uncaught Exception: ${error.message}`);
});

process.on("unhandledRejection", (error) => {
  logger.error(`Unhandled Rejection: ${error}`);
});

start();
