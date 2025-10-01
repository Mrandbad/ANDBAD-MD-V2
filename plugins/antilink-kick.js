const { cmd } = require('../command');
const config = require("../config");

// Default warn limit (can override in config.js by exporting WARN_LIMIT)
const WARN_LIMIT = typeof config.WARN_LIMIT !== 'undefined' ? Number(config.WARN_LIMIT) : 3;

cmd({ on: "body" }, async (conn, m, store, {
  from, body, sender, isGroup, isAdmins, isBotAdmins, reply
}) => {
  try {
    // -- Debug: confirm handler was called
    console.log('[ANTILINK] handler invoked', { from, sender, isGroup, isAdmins, isBotAdmins });

    if (!global.warnings) global.warnings = {};

    // Only process in groups
    if (!isGroup) {
      console.log('[ANTILINK] skipping — not a group');
      return;
    }

    // Ensure bot is admin
    if (!isBotAdmins) {
      console.log('[ANTILINK] skipping — bot is NOT admin (cannot delete/kick)');
      return;
    }

    // Allow admins to post links
    if (isAdmins) {
      console.log('[ANTILINK] sender is admin — skipping anti-link');
      return;
    }

    // Robust extraction of text from different message types
    let text = '';
    try {
      if (body && typeof body === 'string') text = body;
      else if (m && m.message) {
        const msg = m.message;
        text = msg.conversation
             || (msg.extendedTextMessage && msg.extendedTextMessage.text)
             || (msg.imageMessage && msg.imageMessage.caption)
             || (msg.videoMessage && msg.videoMessage.caption)
             || (msg.buttonsResponseMessage && msg.buttonsResponseMessage.selectedButtonId)
             || (msg.templateButtonReplyMessage && msg.templateButtonReplyMessage.selectedId)
             || '';
      }
      text = String(text || '').trim();
    } catch (e) {
      text = String(body || '');
    }

    console.log('[ANTILINK] message text:', text);

    // Patterns: you can add/remove patterns. This includes plain chat.whatsapp.com links without protocol.
    const linkPatterns = [
      /chat\.whatsapp\.com\/\S+/i,
      /wa\.me\/\S+/i,
      /https?:\/\/\S+/i,          // blocks any http(s) link - remove if you only want social links
      /t\.me\/\S+/i,
      /telegram\.me\/\S+/i,
      /youtu(be\.com|\.be)\/\S+/i,
      /facebook\.com\/\S+/i,
      /instagram\.com\/\S+/i,
      /twitter\.com\/\S+/i,
      /discord\.com\/\S+/i,
      /tiktok\.com\/\S+/i,
      /linkedin\.com\/\S+/i,
      /reddit\.com\/\S+/i
    ];

    const containsLink = linkPatterns.some(rx => rx.test(text));
    console.log('[ANTILINK] containsLink:', containsLink);

    // Check config flag (works with boolean true or "true")
    const antiLinkEnabled = (String(config.ANTI_LINK || config.ANTI_LINK_KICK || false) === 'true') || (config.ANTI_LINK === true) || (config.ANTI_LINK_KICK === true);

    if (!containsLink || !antiLinkEnabled) {
      console.log('[ANTILINK] no action (either no link or anti-link disabled)', { containsLink, antiLinkEnabled });
      return;
    }

    console.log(`[ANTILINK] Link detected from ${sender}: "${text}"`);

    // Try to delete the message (two methods to support different Baileys versions)
    try {
      // First attempt
      await conn.sendMessage(from, { delete: m.key });
      console.log('[ANTILINK] delete succeeded: method 1');
    } catch (err1) {
      console.warn('[ANTILINK] delete method1 failed:', err1 && err1.message);
      try {
        // Fallback format
        await conn.sendMessage(from, { delete: { remoteJid: from, id: m.key && m.key.id, fromMe: false } });
        console.log('[ANTILINK] delete succeeded: method 2');
      } catch (err2) {
        console.error('[ANTILINK] delete method2 failed:', err2 && err2.message);
      }
    }

    // Warnings logic
    global.warnings[sender] = (global.warnings[sender] || 0) + 1;
    const count = global.warnings[sender];
    console.log('[ANTILINK] warning count for', sender, count);

    if (count < WARN_LIMIT) {
      await conn.sendMessage(from, {
        text:
          `⚠️ LINKS ARE NOT ALLOWED ⚠️\n` +
          `User: @${sender.split('@')[0]}\n` +
          `Warnings: ${count}/${WARN_LIMIT}\n` +
          `Reason: Sending links`,
        mentions: [sender]
      }, { quoted: m });
      return;
    }

    // If reached warn limit => remove
    await conn.sendMessage(from, {
      text: `@${sender.split('@')[0]} has been removed — warned ${count} times.`,
      mentions: [sender]
    }, { quoted: m });

    try {
      await conn.groupParticipantsUpdate(from, [sender], "remove");
      console.log('[ANTILINK] user removed:', sender);
    } catch (kickErr) {
      console.error('[ANTILINK] failed to remove user:', kickErr);
    }

    // reset warnings for this user after kick
    delete global.warnings[sender];

  } catch (error) {
    console.error('[ANTILINK] unexpected error:', error);
    try { reply('❌ Anti-link error: check bot logs'); } catch(e) {}
  }
});
