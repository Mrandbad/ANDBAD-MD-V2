const config = require('../config')
const { cmd } = require('../command')
const { fetchJson } = require('../lib/functions')

cmd({
    pattern: "ginfo",
    react: "🥏",
    alias: ["groupinfo"],
    desc: "Get group information.",
    category: "group",
    use: '.ginfo',
    filename: __filename
},
async (conn, mek, m, { from, isGroup, isDev, isAdmins, isBotAdmins, reply, participants }) => {
    try {
        // Load remote reply messages
        let msr = {}
        try {
            const res = await fetchJson('https://raw.githubusercontent.com/JawadTech3/KHAN-DATA/refs/heads/main/MSG/mreply.json')
            msr = res.replyMsg || {}
        } catch (err) {
            console.log("⚠️ Could not load mreply.json, using defaults.")
        }

        // Default fallback messages
        const only_gp  = msr.only_gp  || "🚫 This command is for *Groups Only*!"
        const you_adm  = msr.you_adm  || "🚫 Only *Admins* can use this command!"
        const give_adm = msr.give_adm || "⚠️ Please make me *Admin* first!"

        if (!isGroup) return reply(only_gp)
        if (!isAdmins && !isDev) return reply(you_adm, { quoted: mek })
        if (!isBotAdmins) return reply(give_adm)

        // Default group icon if none
        const ppUrls = [
            'https://i.ibb.co/KhYC4FY/1221bc0bdd2354b42b293317ff2adbcf-icon.png',
            'https://i.ibb.co/KhYC4FY/1221bc0bdd2354b42b293317ff2adbcf-icon.png',
            'https://i.ibb.co/KhYC4FY/1221bc0bdd2354b42b293317ff2adbcf-icon.png',
        ]

        let ppUrl
        try {
            ppUrl = await conn.profilePictureUrl(from, 'image')
        } catch {
            ppUrl = ppUrls[Math.floor(Math.random() * ppUrls.length)]
        }

        const metadata = await conn.groupMetadata(from)
        const admins = participants.filter(p => p.admin)
        const listAdmin = admins.map((v, i) => `${i + 1}. @${v.id.split('@')[0]}`).join('\n')
        const owner = metadata.owner ? metadata.owner.split('@')[0] : "Unknown"

        // Group creation date
        const creationDate = new Date(metadata.creation * 1000).toLocaleString()

        const gdata = `*「 Group Information 」*

*Group Name* - ${metadata.subject}
*Group Jid* - ${metadata.id}
*Participant Count* - ${metadata.participants.length}
*Group Creator* - ${owner}
*Created On* - ${creationDate}
*Group Description* - ${metadata.desc?.toString() || 'No description'}

*Group Admins* - 
${listAdmin}
`

        await conn.sendMessage(
            from,
            { image: { url: ppUrl }, caption: gdata, mentions: admins.map(a => a.id) },
            { quoted: mek }
        )
    } catch (e) {
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } })
        console.error(e)
        reply(`❌ *Error Occurred !!*\n\n${e}`)
    }
})
