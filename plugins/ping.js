const config = require('../config');
const { cmd, commands } = require('../command'); // Assuming this is the command handler

// ======= PING COMMAND 1 =======
cmd({
    pattern: '.ping',
    alias: ['.pong', 'ping2'],
    use: 'main',
    desc: "Check bot's response time.",
    category: 'speed',
    react: '⚡',
    filename: __filename
}, async (bot, message, args, { from, quoted, sender, reply }) => {
    try {
        const startTime = Date.now();

        // Emoji arrays
        const reactionEmojis = ['🔥', '⚡', '🚀', '💨', '🎯', '🎉', '🌟', '💥', '🕐', '🔹'];
        const mainEmojis = ['💎', '🏆', '⚡️', '🚀', '🎶', '🌠', '🌀', '🔱', '🛡️', '✨'];

        // Pick random emojis
        const reactEmoji = reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)];
        let mainEmoji = mainEmojis[Math.floor(Math.random() * mainEmojis.length)];

        // Ensure mainEmoji is not equal to reactEmoji
        while (mainEmoji === reactEmoji) {
            mainEmoji = mainEmojis[Math.floor(Math.random() * mainEmojis.length)];
        }

        // Send reaction to user
        await bot.sendMessage(from, {
            react: { text: mainEmoji, key: message.key }
        });

        const endTime = Date.now();
        const latency = ((endTime - startTime) / 1000).toFixed(2); // seconds

        // Send ping message with vCard contact
        const pingMessage = `> *ANDBAD-MD-V2: ${latency}s ${reactEmoji}*`;
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
                    key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
                    message: {
                        contactMessage: {
                            displayName: 'ANDBAD-MD-V2',
                            vcard: `BEGIN:VCARD
VERSION:3.0
N:ANDBAD-MD;BOT;;;
FN:ANDBAD-MD
item1.TEL;waid=255783394967:+255783394967
item1.X-ABLabel:Bot
END:VCARD`
                        }
                    }
                }
            }
        );

    } catch (error) {
        console.log("Error in ping command:", error);
        reply(`An error occurred: ${error.message}`);
    }
});

// ======= PING COMMAND 2 =======
cmd({
    pattern: 'ping2',
    desc: "Check bot's response time.",
    category: 'speed',
    react: '🍂',
    filename: __filename
}, async (bot, message, args, context) => {
    try {
        const start = Date.now();
        const sentMessage = await bot.sendMessage(message.from, { text: '*PINGING...*' });
        const end = Date.now();
        const latency = end - start;

        await bot.sendMessage(message.from, {
            text: `*🔥 pong : ${latency}ms*`
        }, { quoted: sentMessage });

    } catch (error) {
        console.log("Error in ping2 command:", error);
        context.reply('' + error);
    }
});
