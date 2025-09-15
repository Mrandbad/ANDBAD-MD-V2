const config = require('../config');
const { cmd } = require('../command');

// ======= PING COMMAND =======
cmd({
    pattern: "ping",
    alias: ["pong", "ping2"],
    use: "main",
    desc: "Check bot's response time.",
    category: "speed",
    react: "⚡",
    filename: __filename
}, 
async (bot, message, args, { from, quoted, sender, reply }) => {
    try {
        const startTime = Date.now();

        // Emoji sets
        const reactionEmojis = ['🔥', '⚡', '🚀', '💨', '🎯', '🎉', '🌟', '💥', '🕐', '🔹'];
        const mainEmojis = ['💎', '🏆', '⚡️', '🚀', '🎶', '🌠', '🌀', '🔱', '🛡️', '✨'];

        // Pick random emojis
        const reactEmoji = reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)];
        let mainEmoji = mainEmojis[Math.floor(Math.random() * mainEmojis.length)];

        // Ensure mainEmoji != reactEmoji
        while (mainEmoji === reactEmoji) {
            mainEmoji = mainEmojis[Math.floor(Math.random() * mainEmojis.length)];
        }

        // React to user message
        await bot.sendMessage(from, {
            react: { text: mainEmoji, key: message.key }
        });

        const latency = ((Date.now() - startTime) / 1000).toFixed(2); // seconds

        // Styled ping response
        const pingMessage = `
╭━━━〔 *⚡ PING STATUS ⚡* 〕━━━┈⊷
┃◈ *Bot:* ANDBAD-MD-V2
┃◈ *Speed:* ${latency}s ${reactEmoji}
┃◈ *User:* @${sender.split('@')[0]}
╰━━━━━━━━━━━━━━┈⊷
        `.trim();

        await bot.sendMessage(
            from,
            {
                text: pingMessage,
                contextInfo: {
                    mentionedJid: [sender],
                    forwardingScore: 1000,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363315949714553@newsletter',
                        newsletterName: 'ANDBAD-MD-V2',
                        serverMessageId: 143
                    }
                }
            },
            {
                quoted: {
                    key: {
                        fromMe: false,
                        participant: "0@s.whatsapp.net",
                        remoteJid: "status@broadcast"
                    },
                    message: {
                        contactMessage: {
                            displayName: "ANDBAD-MD-V2",
                            vcard: `
BEGIN:VCARD
VERSION:3.0
N:ANDBAD-MD;BOT;;;
FN:ANDBAD-MD
item1.TEL;waid=255792863105:+255792863105
item1.X-ABLabel:Bot
END:VCARD
                            `.trim()
                        }
                    }
                }
            }
        );

    } catch (error) {
        console.error("Error in ping command:", error);
        reply(`❌ An error occurred: ${error.message}`);
    }
});
