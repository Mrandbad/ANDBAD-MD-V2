const { cmd } = require('../command');

// Regex for WhatsApp links
const groupLinkRegex = /chat\.whatsapp\.com\/(?:invite\/)?([0-9A-Za-z]{20,24})/i;
const channelLinkRegex = /whatsapp\.com\/channel\/([0-9A-Za-z]+)/i;

cmd({
  on: "body"
}, async (conn, m, store, {
  from,
  body,
  sender,
  isGroup,
  isAdmin,        // use singular to match your old code
  isBotAdmin,
  reply
}) => {
  try {
    if (!isGroup) return;          // only in groups
    if (!isBotAdmin) return;       // bot must be admin
    if (isAdmin) return;           // ignore group admins

    // Prefer m.text if body is empty
    const textMsg = body || m.text || "";
    let isGroupLink = textMsg.match(groupLinkRegex);
    let isChannelLink = textMsg.match(channelLinkRegex);

    if (isGroupLink || isChannelLink) {
      try {
        // Ignore if it’s this group’s own invite link
        if (isGroupLink) {
          const linkThisGroup = `https://chat.whatsapp.com/${await conn.groupInviteCode(from)}`;
          if (textMsg.includes(linkThisGroup)) return;
        }
      } catch (error) {
        console.error("[ERROR] Could not get group code:", error);
      }

      // Delete message
      try {
        await conn.sendMessage(from, { delete: m.key });
      } catch (err) {
        console.error("Could not delete the message:", err);
      }

      // Warn and remove user
      await conn.sendMessage(from, {
        text: `> ✦ @${sender.split('@')[0]} has been removed for *Anti-Link*! Links to ${isChannelLink ? 'channels' : 'other groups'} are not allowed.`,
        mentions: [sender]
      });

      try {
        await conn.groupParticipantsUpdate(from, [sender], 'remove');
        console.log(`User ${sender} removed from group ${from}`);
      } catch (err) {
        console.error("Could not remove the user:", err);
      }
    }
  } catch (error) {
    console.error("Anti-link error:", error);
    reply("❌ An error occurred while processing anti-link.");
  }
});
