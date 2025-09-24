const config = require('../config');
const { cmd, commands } = require('../command');
const os = require("os");
const { runtime } = require('../lib/functions');

cmd({
    pattern: "menu",
    desc: "Show interactive menu system",
    category: "menu",
    react: "🥰",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        // Show loading reaction
        await conn.sendMessage(from, {
            react: { text: '⏳', key: mek.key }
        });

        // Safe fallbacks in case config values are null
        const OWNER_NAME = config.OWNER_NAME || "Unknown Owner";
        const MODE = config.MODE || "public";
        const PREFIX = config.PREFIX || ".";
        const DESCRIPTION = config.DESCRIPTION || "Powered by ANDBAD-MD-V2";
        const MENU_IMAGE_URL = config.MENU_IMAGE_URL || 'https://files.catbox.moe/tvleub.jpg';

        // Menu caption
        const menuCaption = `╭━━━〔 *𝚫𝚴𝐃𝚩𝚫𝐃-𝚳𝐃-𝛁2* 〕━━━┈⊷
┃★╭──────────────
┃★│ 👑 *Owner :* ${OWNER_NAME}
┃★│ 🤖 *Baileys :* Multi Device
┃★│ 💻 *Type :* NodeJs
┃★│ 🚀 *Platform :* Vercel
┃★│ ⚙️ *Mode :* [${MODE}]
┃★│ 🔣 *Prefix :* [${PREFIX}]
┃★│ 🏷️ *Version :* 5.0.0 Pro
┃★╰──────────────
╰━━━━━━━━━━━━━━━┈⊷

╭━━〔 *Menu List* 〕━━┈⊷
┃◈│1️⃣  📥 *Download Menu*
┃◈│2️⃣  👥 *Group Menu*
┃◈│3️⃣  😄 *Fun Menu*
┃◈│4️⃣  👑 *Owner Menu*
┃◈│5️⃣  🤖 *AI Menu*
┃◈│6️⃣  🎎 *Anime Menu*
┃◈│7️⃣  🔄 *Convert Menu*
┃◈│8️⃣  📌 *Other Menu*
┃◈│9️⃣  💞 *Reactions Menu*
┃◈│🔟  🏠 *Main Menu*
┃◈╰───────────┈⊷
╰──────────────┈⊷

${DESCRIPTION}`;

        const contextInfo = {
            mentionedJid: [m.sender],
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363399999197102@newsletter',
                newsletterName: "ANDBAD-MD-V2",
                serverMessageId: 143
            }
        };

        // Send menu
        const sentMsg = await conn.sendMessage(
            from,
            {
                image: { url: MENU_IMAGE_URL },
                caption: menuCaption,
                contextInfo: contextInfo,
            },
            {
                quoted: {
                    key: {
                        fromMe: false,
                        participant: `0@s.whatsapp.net`,
                        remoteJid: "status@broadcast"
                    },
                    message: {
                        contactMessage: {
                            displayName: "𝚫𝚴𝐃𝚩𝚫𝐃-𝚳𝐃-𝛁2",
                            vcard: `BEGIN:VCARD\nVERSION:3.0\nN:ANDBAD-MD;BOT;;;\nFN:ANDBAD-MD\nitem1.TEL;waid=255783394967:+255783394967\nitem1.X-ABLabel:Bot\nEND:VCARD`
                        }
                    }
                }
            }
        );

        // Send menu audio
        await conn.sendMessage(from, {
            audio: { url: 'https://files.catbox.moe/9sb6x4.mp3' },
            mimetype: 'audio/mp4',
            ptt: true,
        }, {
            quoted: {
                key: {
                    fromMe: false,
                    participant: `0@s.whatsapp.net`,
                    remoteJid: "status@broadcast"
                },
                message: {
                    contactMessage: {
                        displayName: "𝚫𝚴𝐃𝚩𝚫𝐃-𝚳𝐃-𝛁2",
                        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:ANDBAD-MD;BOT;;;\nFN:ANDBAD-MD\nitem1.TEL;waid=255783394967:+255783394967\nitem1.X-ABLabel:Bot\nEND:VCARD`
                    }
                }
            }
        });

        const messageID = sentMsg.key.id;

        // Menu data (shortened here, keep your full menuData content)
        const menuData = {
            '1': { title: "📥 *Download Menu* 📥", content: `... ${DESCRIPTION}` },
            '2': { title: "👥 *Group Menu* 👥", content: `... ${DESCRIPTION}` },
            '3': { title: "😄 *Fun Menu* 😄", content: `... ${DESCRIPTION}` },
            '4': { title: "👑 *Owner Menu* 👑", content: `... ${DESCRIPTION}` },
            '5': { title: "🤖 *AI Menu* 🤖", content: `... ${DESCRIPTION}` },
            '6': { title: "🎎 *Anime Menu* 🎎", content: `... ${DESCRIPTION}` },
            '7': { title: "🔄 *Convert Menu* 🔄", content: `... ${DESCRIPTION}` },
            '8': { title: "📌 *Other Menu* 📌", content: `... ${DESCRIPTION}` },
            '9': { title: "💞 *Reactions Menu* 💞", content: `... ${DESCRIPTION}` },
            '10': { title: "🏠 *Main Menu* 🏠", content: `... ${DESCRIPTION}` },
        };

        // Handler for menu replies
        const handler = async (msgData) => {
            const receivedMsg = msgData.messages[0];
            if (!receivedMsg?.message || !receivedMsg.key?.remoteJid) return;

            const isReplyToMenu =
                receivedMsg.message.extendedTextMessage?.contextInfo?.stanzaId === messageID;

            if (isReplyToMenu) {
                const receivedText = receivedMsg.message.conversation ||
                    receivedMsg.message.extendedTextMessage?.text;
                const senderID = receivedMsg.key.remoteJid;

                await conn.sendMessage(senderID, {
                    react: { text: '⏳', key: receivedMsg.key }
                });

                if (menuData[receivedText]) {
                    const selectedMenu = menuData[receivedText];
                    await conn.sendMessage(
                        senderID,
                        {
                            image: { url: MENU_IMAGE_URL },
                            caption: selectedMenu.content,
                            contextInfo: contextInfo
                        },
                        { quoted: receivedMsg }
                    );
                    await conn.sendMessage(senderID, {
                        react: { text: '✅', key: receivedMsg.key }
                    });
                } else {
                    await conn.sendMessage(
                        senderID,
                        {
                            text: `❌ *Invalid Option!* ❌\n\nPlease reply with a number between 1-10 to select a menu.\n\n*Example:* Reply with "1" for Download Menu\n\n> ${DESCRIPTION}`,
                            contextInfo: contextInfo
                        },
                        { quoted: receivedMsg }
                    );
                    await conn.sendMessage(senderID, {
                        react: { text: '❌', key: receivedMsg.key }
                    });
                }
            }
        };

        // Add listener
        conn.ev.on("messages.upsert", handler);

        // Remove listener after 5 minutes
        setTimeout(() => {
            conn.ev.off("messages.upsert", handler);
        }, 300000);

    } catch (e) {
        console.error('Menu Error:', e);
        await conn.sendMessage(from, {
            react: { text: '❌', key: mek.key }
        });
        reply(`❌ An error occurred: ${e}\n\n> ${config.DESCRIPTION || "ANDBAD-MD-V2"}`);
    }
});