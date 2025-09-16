const config = require('../config');
const { cmd } = require('../command');

const stylizedChars = {
    a: '🅐', b: '🅑', c: '🅒', d: '🅓', e: '🅔', f: '🅕', g: '🅖',
    h: '🅗', i: '🅘', j: '🅙', k: '🅚', l: '🅛', m: '🅜', n: '🅝',
    o: '🅞', p: '🅟', q: '🅠', r: '🅡', s: '🅢', t: '🅣', u: '🅤',
    v: '🅥', w: '🅦', x: '🅧', y: '🅨', z: '🅩',
    '0': '⓿', '1': '➊', '2': '➋', '3': '➌', '4': '➍',
    '5': '➎', '6': '➏', '7': '➐', '8': '➑', '9': '➒'
};

cmd({
    pattern: "chr",
    alias: ["creact"],
    react: "🔤",
    desc: "Send stylized text to a WhatsApp channel",
    category: "general",   // changed from "owner" to "general"
    use: '.chr <channel-link> <text>',
    filename: __filename
},
async (conn, mek, m, { reply, q, command }) => {
    try {
        if (!q) return reply(`Usage:\n${command} https://whatsapp.com/channel/120363315949123456 Hello`);

        const [link, ...textParts] = q.split(' ');
        if (!link.includes("whatsapp.com/channel/")) return reply("Invalid channel link format");

        const inputText = textParts.join(' ').toLowerCase();
        if (!inputText) return reply("Please provide text to convert");

        // Convert to stylized
        const emoji = inputText.split('').map(char => {
            if (char === ' ') return ' ';
            return stylizedChars[char] || char;
        }).join('');

        const channelId = link.split('/')[4]; // extract channelId
        if (!channelId) return reply("Invalid channel link - missing ID");

        // ✅ send message into channel
        await conn.sendMessage(channelId, { text: emoji });

        return reply(`✅ Message sent to channel:\n\n${emoji}`);
    } catch (e) {
        console.error(e);
        reply(`❎ Error: ${e.message || "Failed to send message"}`);
    }
});
