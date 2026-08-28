const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion
} = require("@whiskeysockets/baileys");

const P = require("pino");
const qrcode = require("qrcode-terminal");
const path = require("path");

const config = require("../config");
const logger = require("../utils/logger");

let sock;

async function startWhatsApp() {
  const sessionPath = path.resolve(config.sessionDir);

  const { state, saveCreds } =
    await useMultiFileAuthState(sessionPath);

  const { version } = await fetchLatestBaileysVersion();

  sock = makeWASocket({
    version,
    auth: state,
    logger: P({ level: "silent" }),
    printQRInTerminal: false,
    browser: ["DEMON-BOT", "Chrome", "1.0.0"]
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log("\nScan this QR from WhatsApp > Linked Devices:\n");
      qrcode.generate(qr, { small: true });
    }

    if (connection === "open") {
      logger.success("WhatsApp connected.");
    }

    if (connection === "close") {
      const statusCode =
        lastDisconnect?.error?.output?.statusCode;

      logger.warn(
        `WhatsApp connection closed. Code: ${statusCode || "unknown"}`
      );

      if (statusCode !== DisconnectReason.loggedOut) {
        setTimeout(startWhatsApp, 5000);
      } else {
        logger.error("WhatsApp logged out. Delete session and login again.");
      }
    }
  });

  return sock;
}

function getWhatsAppSocket() {
  return sock;
}

module.exports = {
  startWhatsApp,
  getWhatsAppSocket
};
