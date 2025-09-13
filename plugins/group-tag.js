const { cmd } = require('../command')

// Fixed & Created By JawadTechX + Improved by Lazack28
cmd({
  pattern: "hidetag",
  alias: ["tag", "h"],
  react: "🔊",
  desc: "Tag all Members for Any Message/Media",
  category: "group",
  use: '.hidetag Hello',
  filename: __filename
},
async (conn, mek, m, {
  from, q, isGroup, isCreator, isAdmins,
  participants, reply
}) => {
  try {
    const isUrl = (url) => {
      return /https?:\/\/(www\.)?[\w\-@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([\w\-@:%_\+.~#?&//=]*)/.test(url)
    }

    if (!isGroup) return reply("❌ This command can only be used in groups.")
    if (!isAdmins && !isCreator) return reply("❌ Only group admins can use this command.")

    const mentionAll = { mentions: participants.map(u => u.id).filter(Boolean) }

    // If no message or reply is provided
    if (!q && !m.quoted) {
      return reply("❌ Please provide a message or reply to a message to tag all members.")
    }

    // If replying to a message
    if (m.quoted) {
      const type = Object.keys(m.quoted.message || {})[0] || 'conversation'
      let text = m.quoted.text || m.quoted.body || "📨 Message"

      // Handle text messages
      if (type === 'conversation' || type === 'extendedTextMessage') {
        return await conn.sendMessage(from, { text, ...mentionAll }, { quoted: mek })
      }

      // Handle media
      if (['imageMessage', 'videoMessage', 'audioMessage', 'stickerMessage', 'documentMessage'].includes(type)) {
        try {
          const buffer = await m.quoted.download?.()
          if (!buffer) return reply("❌ Failed to download the quoted media.")

          let content
          switch (type) {
            case "imageMessage":
              content = { image: buffer, caption: text, ...mentionAll }
              break
            case "videoMessage":
              content = {
                video: buffer,
                caption: text,
                gifPlayback: m.quoted.message?.videoMessage?.gifPlayback || false,
                ...mentionAll
              }
              break
            case "audioMessage":
              content = {
                audio: buffer,
                mimetype: "audio/mp4",
                ptt: m.quoted.message?.audioMessage?.ptt || false,
                ...mentionAll
              }
              break
            case "stickerMessage":
              content = { sticker: buffer, ...mentionAll }
              break
            case "documentMessage":
              content = {
                document: buffer,
                mimetype: m.quoted.message?.documentMessage?.mimetype || "application/octet-stream",
                fileName: m.quoted.message?.documentMessage?.fileName || "file",
                caption: text,
                ...mentionAll
              }
              break
          }

          if (content) {
            return await conn.sendMessage(from, content, { quoted: mek })
          }
        } catch (e) {
          console.error("Media handling error:", e)
          return reply("❌ Failed to process the media. Sending as text instead.")
        }
      }

      // Fallback for unknown types
      return await conn.sendMessage(from, { text, ...mentionAll }, { quoted: mek })
    }

    // If direct message (no quoted)
    if (q) {
      return await conn.sendMessage(from, { text: q, ...mentionAll }, { quoted: mek })
    }

  } catch (e) {
    console.error("hidetag error:", e)
    reply(`❌ *Error Occurred !!*\n\n${e.message}`)
  }
})
