const config = require('../config');
const { cmd } = require('../command');

cmd({
    pattern: "out",
    alias: ["ck", "🦶"],
    desc: "Removes all members with specific country code from the group",
    category: "admin",
    react: "❌",
    filename: __filename
},
async (conn, mek, m, {
    from, q, isGroup, reply, groupMetadata, senderNumber
}) => {
    // Check if the command is used in a group
    if (!isGroup) return reply("❌ This command can only be used in groups.");

    // Check if sender is owner from config.js
    if (senderNumber !== config.OWNER_NUMBER) {
        return reply("❌ Only the bot owner can use this command.");
    }

    // ✅ Detect bot’s JID properly
    const botNumber = conn.user.id.split(":")[0] + "@s.whatsapp.net";
    const botIsAdmin = groupMetadata.participants
        .filter(p => p.admin) // get all admins
        .map(p => p.id)       // map to IDs
        .includes(botNumber); // check if bot’s JID is in admins

    if (!botIsAdmin) {
        return reply("❌ I need to be an admin to use this command.");
    }

    if (!q) return reply("❌ Please provide a country code. Example: .out 92");

    const countryCode = q.trim();
    if (!/^\d+$/.test(countryCode)) {
        return reply("❌ Invalid country code. Please provide only numbers (e.g., 92 for +92 numbers)");
    }

    try {
        const participants = groupMetadata.participants;
        const targets = participants.filter(
            participant => participant.id.startsWith(countryCode) && 
                         !participant.admin // Don't remove admins
        );

        if (targets.length === 0) {
            return reply(`❌ No members found with country code +${countryCode}`);
        }

        const jids = targets.map(p => p.id);
        await conn.groupParticipantsUpdate(from, jids, "remove");
        
        reply(`✅ Successfully removed ${targets.length} members with country code +${countryCode}`);
    } catch (error) {
        console.error("Out command error:", error);
        reply("❌ Failed to remove members. Error: " + error.message);
    }
});
