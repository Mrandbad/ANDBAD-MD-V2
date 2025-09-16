const { cmd } = require('../command');

cmd({
    pattern: "remove",
    alias: ["kick", "k"],
    desc: "Removes a member from the group",
    category: "admin",
    react: "❌",
    filename: __filename
},
async (conn, mek, m, {
    from, q, isGroup, reply, quoted, groupMetadata, senderNumber
}) => {
    // Check if the command is used in a group
    if (!isGroup) return reply("❌ This command can only be used in groups.");

    // ✅ Check if sender is admin
    const senderJid = senderNumber + "@s.whatsapp.net";
    const senderIsAdmin = groupMetadata.participants
        .filter(p => p.admin)
        .map(p => p.id)
        .includes(senderJid);

    if (!senderIsAdmin) {
        return reply("❌ Only group admins can use this command.");
    }

    // ✅ Check if bot is admin
    const botNumber = conn.user.id.split(":")[0] + "@s.whatsapp.net";
    const botIsAdmin = groupMetadata.participants
        .filter(p => p.admin)
        .map(p => p.id)
        .includes(botNumber);

    if (!botIsAdmin) {
        return reply("❌ I need to be an admin to use this command.");
    }

    // Get number to remove
    let number;
    if (m.quoted) {
        number = m.quoted.sender.split("@")[0]; // If replying to a message
    } else if (q && q.includes("@")) {
        number = q.replace(/[@\s]/g, ''); // If mentioning a user
    } else {
        return reply("❌ Please reply to a message or mention a user to remove.");
    }

    const jid = number + "@s.whatsapp.net";

    try {
        await conn.groupParticipantsUpdate(from, [jid], "remove");
        reply(`✅ Successfully removed @${number}`, { mentions: [jid] });
    } catch (error) {
        console.error("Remove command error:", error);
        reply("❌ Failed to remove the member. Error: " + error.message);
    }
});
