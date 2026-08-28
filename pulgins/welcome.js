async function welcome(sock, update) {
  try {
    const { id, participants, action } = update;

    if (action !== "add") return;

    for (const participant of participants) {
      const number = participant.split("@")[0];

      await sock.sendMessage(id, {
        text:
          `👋 Welcome @${number}!\n\n` +
          `You are now a member of this group.\n` +
          `Please read the group rules and enjoy! 😈`,
        mentions: [participant]
      });
    }
  } catch (error) {
    console.error("Welcome error:", error.message);
  }
}

module.exports = welcome;
