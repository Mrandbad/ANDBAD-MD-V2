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
    // ✅ Ensure it's a group
    if (!isGroup) return reply("❌ This command can only be used in groups.");

    // ✅ Check if sender is admin
    const senderJid = senderNumber + "@s.whatsapp.net";
    const senderIsAdmin = groupMetadata.participants
        .filter(p => p.admin === "admin" || p.admin === "superadmin")
        .map(p => p.id)
        .includes(senderJid);

    if (!senderIsAdmin) {
        return reply("❌ Only group admins can use this command.");
    }

    // ✅ Check if bot is admin
    const botNumber = conn.user.id.split(":")[0] + "@s.whatsapp.net";
    const botIsAdmin = groupMetadata.participants
        .filter(p => p.admin === "admin" || p.admin === "superadmin")
        .map(p => p.id)
        .includes(botNumber);

    if (!botIsAdmin) {
        return reply("❌ I need to be an admin to use this command.");
    }

    // ✅ Get number to remove
    let number;
    if (m.quoted) {
        number = m.quoted.sender.split("@")[0]; // From replied message
    } else if (q && q.includes("@")) {
        number = q.replace(/[@\s]/g, ''); // From mention
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
