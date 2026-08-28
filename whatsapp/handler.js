const config = require("../config");
const logger = require("../utils/logger");

const ping = require("../commands/ping");
const menu = require("../commands/menu");
const help = require("../commands/help");
const alive = require("../commands/alive");
const info = require("../commands/info");

const welcome = require("../plugins/welcome");
const admin = require("../plugins/admin");

const cooldowns = new Map();

const commands = {
  ping,
  menu,
  help,
  alive,
  info
};

function isOnCooldown(user) {
  const now = Date.now();
  const last = cooldowns.get(user) || 0;

  if (now - last < config.cooldownMs) {
    return true;
  }

  cooldowns.set(user, now);
  return false;
}

function getText(message) {
  return (
    message?.conversation ||
    message?.extendedTextMessage?.text ||
    message?.imageMessage?.caption ||
    message?.videoMessage?.caption ||
    ""
  );
}

function getSender(message) {
  return (
    message?.key?.participant ||
    message?.key?.remoteJid ||
    ""
  );
}

async function handleMessage(sock, message) {
  try {
    if (!message.message) return;
    if (message.key?.fromMe) return;

    const jid = message.key.remoteJid;
    const text = getText(message).trim();

    if (!text) return;

    const sender = getSender(message);

    /*
     * Group welcome
     */
    if (
      message.message?.groupInviteMessage ||
      message.message?.protocolMessage
    ) {
      return;
    }

    /*
     * Commands
     */
    if (text.startsWith(config.prefix)) {
      if (isOnCooldown(sender)) return;

      const body = text.slice(config.prefix.length).trim();

      const [commandName, ...args] = body.split(/\s+/);

      const command = commands[commandName.toLowerCase()];

      if (command) {
        await command({
          sock,
          jid,
          sender,
          args,
          text,
          message
        });

        return;
      }

      /*
       * Plugin commands
       */
      if (commandName.toLowerCase().startsWith("group")) {
        await admin({
          sock,
          jid,
          sender,
          args,
          text,
          message
        });

        return;
      }

      if (
        ["welcome", "setname", "kick", "add", "promote", "demote"]
          .includes(commandName.toLowerCase())
      ) {
        await admin({
          sock,
          jid,
          sender,
          args,
          text,
          message
        });

        return;
      }

      await sock.sendMessage(jid, {
        text: `❌ Unknown command.\n\nUse ${config.prefix}menu`
      });

      return;
    }

    /*
     * Auto reply
     */
    if (config.autoReply) {
      const lower = text.toLowerCase();

      let reply = null;

      if (["hi", "hello", "hey"].includes(lower)) {
        reply = "Hey 👋 Main DEMON-BOT hoon. Kya help chahiye?";
      }

      if (lower.includes("how are you")) {
        reply = "Main bilkul ready hoon 😈 Tum batao kya karna hai?";
      }

      if (lower === "thanks" || lower === "thank you") {
        reply = "You're welcome 😄";
      }

      if (lower === "good morning") {
        reply = "Good morning ☀️ Have a great day!";
      }

      if (lower === "good night") {
        reply = "Good night 🌙";
      }

      if (reply) {
        await sock.sendMessage(jid, {
          text: reply
        });
      }
    }

  } catch (error) {
    logger.error(`Message handler error: ${error.message}`);
  }
}

function registerWhatsAppHandler(sock) {
  sock.ev.on("messages.upsert", async ({ messages }) => {
    for (const message of messages) {
      await handleMessage(sock, message);
    }
  });

  sock.ev.on("group-participants.update", async (update) => {
    if (config.welcome) {
      await welcome(sock, update);
    }
  });

  logger.success("WhatsApp handlers loaded.");
}

module.exports = {
  registerWhatsAppHandler
};
