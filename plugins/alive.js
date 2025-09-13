const { cmd } = require('../command');
const os = require("os");
const { runtime } = require('../lib/functions');
const config = require('../config');

cmd({
    pattern: "alive",
    alias: ["status", "online", "a"],
    desc: "Check if bot is alive or not",
    category: "main",
    react: "⚡",
    filename: __filename
}, async (conn, mek, m, { from, sender, reply }) => {
    try {
        const status = `
╭───〔 *${config.BOT_NAME}* 〕───◉
│✨ *Bot is Active & Online!*
│
│🧠 *Owner:* ${config.OWNER_NAME}
│⚡ *Version:* 5.0.0 Pro
│📝 *Prefix:* [${config.PREFIX}]
│📳 *Mode:* [${config.MODE}]
│💾 *RAM:* ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${(os.totalmem() / 1024 / 1024).toFixed(2)}MB
│🖥️ *Host:* ${os.hostname()}
│⌛ *Uptime:* ${runtime(process.uptime())}
╰────────────────────◉
> ${config.DESCRIPTION}`;

        // Buttons array
        const buttons = [
            { buttonId: `${config.PREFIX}menu`, buttonText: { displayText: "📂 MENU OPTIONS" }, type: 1 },
            { buttonId: `${config.PREFIX}owner`, buttonText: { displayText: "👑 OWNER" }, type: 1 },
            { buttonId: `${config.PREFIX}ping`, buttonText: { displayText: "📶 PING" }, type: 1 },
            { buttonId: `${config.PREFIX}system`, buttonText: { displayText: "🖥️ SYSTEM" }, type: 1 },
            { buttonId: `${config.PREFIX}repo`, buttonText: { displayText: "🛠️ REPO" }, type: 1 },
        ];

        await conn.sendMessage(from, {
            image: { url: config.MENU_IMAGE_URL },
            caption: status,
            footer: "© Power by 𝐀𝐍𝐃𝐑𝐄𝐖-𝐓𝐙🇹🇿",
            buttons: buttons,
            headerType: 4 // 4 = image with buttons
        }, { quoted: mek });

    } catch (err) {
        console.error(err);
        await conn.sendMessage(from, { react: { text: "❌", key: m.key } });
        reply("❌ An error occurred while processing your request.");
    }
});


