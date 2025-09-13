const { igdl } = require('ruhend-scraper')
const { cmd } = require("../command");

cmd({
  pattern: "fb",
  alias: ["facebook", "fbdl"],
  desc: "Download Facebook videos",
  category: "download",
  filename: __filename,
  use: "<Facebook URL>",
}, async (conn, m, store, { from, args, q, reply }) => {
  try {
    // Check if a URL is provided
    if (!q || !q.startsWith("http")) {
      return reply("*`Need a valid Facebook URL`*\n\nExample: `.fb https://www.facebook.com/...`");
    }

    // Add loading reaction
    await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

    // Fetch video data
    let res;
    try {
      res = await igdl(q);
    } catch (e) {
      return reply("❌ Failed to fetch data. Please check the link.");
    }

    let result = res.data;
    if (!result || result.length === 0) {
      return reply("❌ No results found.");
    }

    // Prefer 720p > fallback 360p
    let data = result.find(i => i.resolution === "720p (HD)") || result.find(i => i.resolution === "360p (SD)");
    if (!data) {
      return reply("❌ No suitable resolution found.");
    }

    // Send the video
    let videoUrl = data.url;
    await conn.sendMessage(from, {
      video: { url: videoUrl },
      caption: "📥 *Facebook Video Downloaded*\n\n- *Power by 𝐀𝐍𝐃𝐑𝐄𝐖-𝐓𝐙🇹🇿*",
      fileName: "fb.mp4",
      mimetype: "video/mp4"
    }, { quoted: m });

    // Success reaction
    await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

  } catch (error) {
    console.error("Error:", error);
    reply("❌ Error fetching the video. Please try again.");
    await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
  }
});
