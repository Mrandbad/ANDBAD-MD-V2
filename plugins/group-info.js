const config = require('../config')
const { cmd, commands } = require('../command')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('../lib/functions')

cmd({
    pattern: "ginfo",
    react: "🥏",
    alias: ["groupinfo"],
    desc: "Get group information.",
    category: "group",
    use: '.ginfo',
    filename: __filename
},
async (conn, mek, m, { from, quoted, isGroup, sender, isDev, isAdmins, isBotAdmins, reply, participants }) => {
    try {
        const msr = (await fetchJson('https://raw.githubusercontent.com/JawadTech3/KHAN-DATA/refs/heads/main/MSG/mreply.json')).replyMsg

        if (!isGroup) return reply(msr.only_gp)
        if (!isAdmins && !isDev) return reply(msr.you_adm, { quoted: mek })
        if (!isBotAdmins) return reply(msr.give_adm)

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

        const gdata = `*「 Group Information 」*

*Group Name* - ${metadata.subject}
*Group Jid* - ${metadata.id}
*Participant Count* - ${metadata.participants.length}
*Group Creator* - ${owner}
*Group Description* - ${metadata.desc?.toString() || 'No description'}

*Group Admins* - 
${listAdmin}
`

        await conn.sendMessage(from, { image: { url: ppUrl }, caption: gdata, mentions: admins.map(a => a.id) }, { quoted: mek })
    } catch (e) {
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } })
        console.error(e)
        reply(`❌ *Error Occurred !!*\n\n${e}`)
    }
})
