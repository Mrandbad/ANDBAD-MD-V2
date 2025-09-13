const { cmd } = require('../command');
const config = require('../config');

cmd({
    pattern: "owner",
    react: "✅",
    desc: "Get owner number",
    category: "main",
    filename: __filename
},
async (conn, mek, m, { from }) => {
    try {
        // Fetch owner details from config
        const ownerNumber = config.OWNER_NUMBER;
        const ownerName   = config.OWNER_NAME;

        // Create vCard
        const vcard = `
BEGIN:VCARD
VERSION:3.0
FN:${ownerName}
TEL;type=CELL;type=VOICE;waid=${ownerNumber.replace('+', '')}:${ownerNumber}
END:VCARD
`.trim();

        // Send vCard contact
        await conn.sendMessage(from, {
            contacts: {
                displayName: ownerName,
                contacts: [{ vcard }]
            }
        });

        // Send owner info with image
        await conn.sendMessage(from, {
            image: { url: 'https://files.catbox.moe/sgvdxm.jpg' },
            caption: `
╭━━〔 *𝚫𝚴𝐃𝚩𝚫𝐃-𝚳𝐃-𝛁2* 〕━━┈⊷
┃◈╭─────────────·๏
┃◈┃• *Here is the owner details*
┃◈┃• *Name*   : ${ownerName}
┃◈┃• *Number* : ${ownerNumber}
┃◈┃• *Version*: 2.0.0 Beta
┃◈└───────────┈⊷
╰──────────────┈⊷
> © Power by 𝐀𝐍𝐃𝐑𝐄𝐖-𝐓𝐙🇹🇿
            `.trim(),
            contextInfo: {
                mentionedJid: [`${ownerNumber.replace('+', '')}@s.whatsapp.net`],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363315949714553@newsletter',
                    newsletterName: '𝐀𝐍𝐃𝐑𝐄𝐖-𝐓𝐙🇹🇿',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

        // Send audio (PTT style)
        await conn.sendMessage(from, {
            audio: { url: 'https://files.catbox.moe/9sb6x4.mp3' },
            mimetype: 'audio/mp4',
            ptt: true
        }, { quoted: mek });

    } catch (error) {
        console.error(error);
        reply(`❌ An error occurred: ${error.message}`);
    }
});
