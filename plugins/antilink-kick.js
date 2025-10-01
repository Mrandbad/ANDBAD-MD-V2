const { cmd } = require('../command');
const config = require("../config");

// Anti-Link Patterns
const linkPatterns = [
  /chat\.whatsapp\.com\/\S+/i,
  /wa\.me\/\S+/i,
  /whatsapp\.com\/channel\/[a-zA-Z0-9_-]+/i,
  /t\.me\/\S+/i,
  /telegram\.me\/\S+/i,
  /youtube\.com\/\S+/i,
  /youtu\.be\/\S+/i,
  /facebook\.com\/\S+/i,
  /fb\.me\/\S+/i,
  /instagram\.com\/\S+/i,
  /twitter\.com\/\S+/i,
  /tiktok\.com\/\S+/i,
  /linkedin\.com\/\S+/i,
  /snapchat\.com\/\S+/i,
  /pinterest\.com\/\S+/i,
  /reddit\.com\/\S+/i,
  /ngl\/\S+/i,
  /discord\.com\/\S+/i,
  /twitch\.tv\/\S+/i,
  /vimeo\.com\/\S+/i,
  /dailymotion\.com\/\S+/i,
  /medium\.com\/\S+/i
];

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
    if (!isGroup || !isBotAdmins) return; // Only run in groups & when bot is admin
    if (isAdmins) return; // Allow group admins to send links

    const containsLink = linkPatterns.some(pattern => pattern.test(body));

    if (containsLink && config.ANTI_LINK_KICK === 'true') {
      // Try to delete the message
      try {
        await conn.sendMessage(from, { delete: m.key });
      } catch (e) {
        console.error("Failed to delete message:", e);
      }

      // Warn and kick user
      await conn.sendMessage(from, {
        text: `⚠️ Links are not allowed in this group.\n@${sender.split('@')[0]} has been removed. 🚫`,
        mentions: [sender]
      }, { quoted: m });

      try {
        await conn.groupParticipantsUpdate(from, [sender], "remove");
      } catch (e) {
        console.error("Failed to remove participant:", e);
      }
    }
  } catch (error) {
    console.error(error);
    reply("⚠️ An error occurred while processing the anti-link system.");
  }
});
