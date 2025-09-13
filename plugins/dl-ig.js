const { igdl } = require('ruhend-scraper');
const { cmd } = require('../command');

cmd({
  pattern: "instagram",
  alias: ["ig"],
  desc: "Download Instagram videos or photos",
  category: "downloads",
  filename: __filename,
  use: "<Instagram URL>",
}, async (conn, m, store, { from, args, q, reply }) => {
  try {
    if (!q || !q.startsWith("http")) {
      return reply("*`Please provide a valid Instagram link`*\n\nExample: `.ig https://www.instagram.com/p/...`");
    }

    // Loading reaction
    await conn.sendMessage(from, { react: { text: "⏳", key: m.key } });

    // Fetch Instagram media
    const res = await igdl(q);
    const data = res.data;

    if (!data || data.length === 0) {
      return reply("❌ No media found for this link.");
    }

    // Send all media found
    for (let media of data) {
      await conn.sendMessage(from, {
        video: { url: media.url },
        fileName: "instagram.mp4",
        mimetype: "video/mp4",
        caption: "📥 *Instagram Media Downloaded*\n\n- *Power by 𝐀𝐍𝐃𝐑𝐄𝐖-𝐓𝐙🇹🇿*"
      }, { quoted: m });

      // Success reaction
      await conn.sendMessage(from, { react: { text: "✅", key: m.key } });
    }

  } catch (error) {
    console.error(error);
    reply("❌ An error occurred while fetching Instagram media.");
    await conn.sendMessage(from, { react: { text: "❌", key: m.key } });
  }
});

