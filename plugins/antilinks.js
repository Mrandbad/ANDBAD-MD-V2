const { cmd } = require('../command');
const config = require("../config");

cmd({
  on: "body"
}, async (conn, m, store, {
  from,
  body,
  sender,
  isGroup,
  isAdmins,
  isBotAdmins,
  reply
}) => {
  try {
    if (!global.warnings) global.warnings = {};

    // Only act in groups where bot is admin and sender isn't admin
    if (!isGroup || !isBotAdmins || isAdmins) return;

    // Link patterns to detect
    const linkPatterns = [
      /chat\.whatsapp\.com\/\S+/i,
      /wa\.me\/\S+/i,
      /api\.whatsapp\.com\/\S+/i,
      /whatsapp\.com\/channel\/[a-zA-Z0-9_-]+/i,
      /t\.me\/\S+/i,
      /telegram\.me\/\S+/i,
      /twitter\.com\/\S+/i,
      /linkedin\.com\/\S+/i,
      /reddit\.com\/\S+/i,
      /discord\.com\/\S+/i,
      /twitch\.tv\/\S+/i,
      /vimeo\.com\/\S+/i,
      /dailymotion\.com\/\S+/i,
      /medium\.com\/\S+/i
    ];

    // Check if message contains forbidden links
    const containsLink = linkPatterns.some(pattern => pattern.test(body));

    if (containsLink && String(config.ANTI_LINK) === 'true') {
      console.log(`🚨 Link detected from ${sender}: ${body}`);

      // Try to delete the message
      try {
        await conn.sendMessage(from, {
          delete: { remoteJid: from, id: m.key.id, fromMe: false }
        });
        console.log(`Message deleted: ${m.key.id}`);
      } catch (error) {
        console.error("Failed to delete message:", error);
      }

      // Update warnings
      global.warnings[sender] = (global.warnings[sender] || 0) + 1;
      const warningCount = global.warnings[sender];
      const warnLimit = 3; // you can change to 2 if you want stricter rules

      if (warningCount < warnLimit) {
        // Send warning
        await conn.sendMessage(from, {
          text: `‎*⚠️ LINKS ARE NOT ALLOWED ⚠️*\n` +
                `*╭────⬡ WARNING ⬡────*\n` +
                `*├▢ USER :* @${sender.split('@')[0]}\n` +
                `*├▢ COUNT : ${warningCount}/${warnLimit}*\n` +
                `*├▢ REASON : LINK SENDING*\n` +
                `*╰────────────────*`,
          mentions: [sender]
        });
      } else {
        // Kick user
        await conn.sendMessage(from, {
          text: `@${sender.split('@')[0]} *HAS BEEN REMOVED - WARN LIMIT (${warnLimit}) EXCEEDED!* 🚫`,
          mentions: [sender]
        });

        try {
          await conn.groupParticipantsUpdate(from, [sender], "remove");
        } catch (e) {
          console.error("Failed to remove participant:", e);
        }

        delete global.warnings[sender]; // reset warnings after kick
      }
    }
  } catch (error) {
    console.error("Anti-link error:", error);
    reply("❌ An error occurred while processing anti-link.");
  }
});
