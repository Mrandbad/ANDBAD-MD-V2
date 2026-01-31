const { getSettings, getSudoUsers } = require("../Database/config");
const fetch = require('node-fetch');

module.exports = async (client, m, store, chatbotpmSetting) => {
    try {
        if (!m || !m.key || !m.message || !m.key.remoteJid.endsWith("@s.whatsapp.net") || m.key.fromMe) {
            return;
        }

        if (!chatbotpmSetting) {
            return;
        }

        const botNumber = await client.decodeJid(client.user.id);
        const sender = m.sender ? await client.decodeJid(m.sender) : null;
        const senderNumber = sender ? sender.split('@')[0] : null;

        if (!sender || !senderNumber) {
            return;
        }

        const sudoUsers = await getSudoUsers();
        if (sudoUsers.includes(senderNumber) || sender === botNumber) {
            return;
        }

        const messageContent = (
            m.message?.conversation ||
            m.message?.extendedTextMessage?.text ||
            m.message?.imageMessage?.caption ||
            m.message?.videoMessage?.caption ||
            ""
        ).trim();

        const { prefix } = await getSettings();
        if (messageContent.startsWith(prefix)) {
            return;
        }

        if (!messageContent) {
            return;
        }

        try {
            const encodedText = encodeURIComponent(messageContent);
            const systemPrompt = encodeURIComponent("You were created by Fredi Ezra if asked so and your name is Fredi AI and you must always reply with a fee and cranky tone!! and must always answer the questions asked intelligently!");
            const apiUrl = `https://api.nekolabs.web.id/text.gen/gemini/2.0-flash?text=${encodedText}&systemPrompt=${systemPrompt}`;
            
            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }

            const data = await response.json();

            if (!data.success || !data.result) {
                throw new Error("invalid API response");
            }

            await client.sendMessage(
                m.key.remoteJid,
                { text: data.result },
                { quoted: m }
            );

        } catch (e) {
            console.error(`andbad-md chatbotpm error:`, e);
            await client.sendMessage(
                m.key.remoteJid,
                { text: `chatbot error: ${e.message}` },
                { quoted: m }
            );
        }
    } catch (e) {
        console.error("fee-xmd chatbotpm error:", e);
    }
};