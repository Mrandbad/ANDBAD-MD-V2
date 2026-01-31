const { getSettings } = require("../Database/config");

const formatStylishReply = (message) => {
    return `┏━━━━━━━━━━━━━━━➤\n┃➤ ${message}\n┗━━━━━━━━━━━━━━━`;
};

module.exports = async (client, m) => {
    try {
        if (!m?.message) return;
        if (m.key.fromMe) return;
        if (!m.isGroup) return;

        const exemptGroup = "120363156185607326@g.us";
        if (m.chat === exemptGroup) return;

        const settings = await getSettings();
        const mode = settings.antistatusmention;

        if (!mode || mode === "off" || mode === "false") return;

        if (m.mtype !== 'groupStatusMentionMessage') return;

        const isAdmin = m.isAdmin;
        const isBotAdmin = m.isBotAdmin;

        if (isAdmin) {
            await client.sendMessage(m.chat, {
                text: formatStylishReply(`Admin Status Mention Detected\nUser: @${m.sender.split("@")[0]}\nAdmins get a free pass for status mentions\nBut seriously, keep it minimal! 😒`),
                mentions: [m.sender],
            });
            return;
        }

        if (!isBotAdmin) {
            await client.sendMessage(m.chat, {
                text: formatStylishReply(`Can't Delete Status Mention! 😤\nUser: @${m.sender.split("@")[0]} just dropped a status mention\nBut I'm not admin here! How embarrassing...\nAdmins: Make me admin so I can delete this nonsense!`),
                mentions: [m.sender],
            });
            return;
        }

        await client.sendMessage(m.chat, {
            delete: {
                remoteJid: m.chat,
                fromMe: false,
                id: m.key.id,
                participant: m.sender,
            },
        });

        if (mode === "delete" || mode === "true") {
            await client.sendMessage(m.chat, {
                text: formatStylishReply(`Status Mention Deleted! 🗑️\nUser: @${m.sender.split("@")[0]} thought they could spam\nStatus mentions are NOT allowed here!\nNext violation = Immediate removal! ⚠️`),
                mentions: [m.sender],
            });
        }

        if (mode === "remove") {
            try {
                await client.groupParticipantsUpdate(m.chat, [m.sender], "remove");
                await client.sendMessage(m.chat, {
                    text: formatStylishReply(`User Removed for Status Mention! 🚫\n@${m.sender.split("@")[0]} ignored the warnings\nNo status mentions allowed in this group!\nLearn the rules or stay out! 😤`),
                    mentions: [m.sender],
                });
            } catch {
                await client.sendMessage(m.chat, {
                    text: formatStylishReply(`Failed to Remove User! 😠\nTried to kick @${m.sender.split("@")[0]} for status mention\nBut I don't have enough permissions!\nAdmins: Fix my permissions and promote me or deal with spammers yourself!`),
                    mentions: [m.sender],
                });
            }
        }
    } catch (err) {}
};