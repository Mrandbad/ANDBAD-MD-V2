const { cmd, commands } = require('../command');
const axios = require('axios');

cmd({
    pattern: "pair",
    alias: ["getpair", "clonebot"],
    react: "✅",
    desc: "Get pairing code for 𝚫𝚴𝐃𝚩𝚫𝐃-𝚳𝐃-𝛁2 bot",
    category: "download",
    use: ".pair +255783394XXX",
    filename: __filename
}, async (conn, mek, m, {
    from, quoted, body, isCmd, command, args, q, isGroup,
    sender, senderNumber, botNumber2, botNumber, pushname,
    isMe, isOwner, groupMetadata, groupName, participants,
    groupAdmins, isBotAdmins, isAdmins, reply
}) => {
    try {
        const phoneNumber = q ? q.trim() : null;

        // Validate phone number format
        if (!phoneNumber || !phoneNumber.match(/^\+?\d{10,15}$/)) {
            return await reply("❌ Please provide a valid phone number with the country code.\nExample: `.pair +2557833949XXX`");
        }

        // Request pairing code from your backend
        const response = await axios.get(`https://session.crissvevo.co.tz/pair?phone=${encodeURIComponent(phoneNumber)}`);

        if (!response.data || !response.data.code) {
            return await reply("❌ Failed to retrieve pairing code. Please try again later.");
        }

        const pairingCode = response.data.code;

        await reply(`✅ *𝚫𝚴𝐃𝚩𝚫𝐃-𝚳𝐃-𝛁2 PAIRING SUCCESSFUL!*\n\n📲 *Phone:* ${phoneNumber}\n🔐 *Pairing Code:* ${pairingCode}`);

    } catch (error) {
        console.error("Pair command error:", error);
        await reply("❌ An error occurred while fetching the pairing code. Please try again later.");
    }
});


