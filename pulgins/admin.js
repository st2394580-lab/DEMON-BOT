const config = require("../config");

async function isGroup(sock, jid) {
  return jid.endsWith("@g.us");
}

async function getMetadata(sock, jid) {
  return await sock.groupMetadata(jid);
}

async function isAdmin(sock, jid, sender) {
  const metadata = await getMetadata(sock, jid);

  const participant = metadata.participants.find(
    p => p.id === sender
  );

  return Boolean(
    participant &&
    (participant.admin === "admin" ||
      participant.admin === "superadmin")
  );
}

module.exports = async function admin({
  sock,
  jid,
  sender,
  args,
  text,
  message
}) {
  try {
    if (!(await isGroup(sock, jid))) {
      await sock.sendMessage(jid, {
        text: "❌ This command works only in groups."
      });
      return;
    }

    if (!(await isAdmin(sock, jid, sender))) {
      await sock.sendMessage(jid, {
        text: "❌ Only group admins can use this command."
      });
      return;
    }

    const command =
      text
        .slice(config.prefix.length)
        .trim()
        .split(/\s+/)[0]
        .toLowerCase();

    const metadata = await getMetadata(sock, jid);

    if (command === "groupinfo") {
      await sock.sendMessage(jid, {
        text:
          `👥 *GROUP INFO*\n\n` +
          `📛 Name: ${metadata.subject}\n` +
          `👤 Members: ${metadata.participants.length}\n` +
          `🆔 ID: ${jid}`
      });
      return;
    }

    if (command === "setname") {
      const newName = args.join(" ");

      if (!newName) {
        await sock.sendMessage(jid, {
          text: `Usage: ${config.prefix}setname New Group Name`
        });
        return;
      }

      await sock.groupUpdateSubject(jid, newName);

      await sock.sendMessage(jid, {
        text: `✅ Group name changed to:\n${newName}`
      });

      return;
    }

    if (command === "welcome") {
      const option = args[0]?.toLowerCase();

      if (!["on", "off"].includes(option)) {
        await sock.sendMessage(jid, {
          text: `Usage: ${config.prefix}welcome on/off`
        });
        return;
      }

      await sock.sendMessage(jid, {
        text: `✅ Welcome setting requested: ${option}`
      });

      return;
    }

    if (command === "promote" || command === "demote") {
      const target =
        message.message?.extendedTextMessage?.contextInfo
          ?.mentionedJid?.[0];

      if (!target) {
        await sock.sendMessage(jid, {
          text: `Reply to a user's message or mention them.`
        });
        return;
      }

      if (command === "promote") {
        await sock.groupParticipantsUpdate(
          jid,
          [target],
          "promote"
        );

        await sock.sendMessage(jid, {
          text: "✅ User promoted."
        });
      } else {
        await sock.groupParticipantsUpdate(
          jid,
          [target],
          "demote"
        );

        await sock.sendMessage(jid, {
          text: "✅ User demoted."
        });
      }

      return;
    }

    if (command === "kick") {
      const target =
        message.message?.extendedTextMessage?.contextInfo
          ?.mentionedJid?.[0];

      if (!target) {
        await sock.sendMessage(jid, {
          text: "❌ Mention the user you want to remove."
        });
        return;
      }

      await sock.groupParticipantsUpdate(
        jid,
        [target],
        "remove"
      );

      await sock.sendMessage(jid, {
        text: "✅ User removed."
      });

      return;
    }

    await sock.sendMessage(jid, {
      text: "❌ Unknown group/admin command."
    });

  } catch (error) {
    console.error("Admin plugin error:", error.message);
  }
};
