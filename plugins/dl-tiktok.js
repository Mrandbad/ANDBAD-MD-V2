const fetch = require('node-fetch');
const { cmd } = require('../command');

cmd({
  pattern: "tiktok",
  alias: ["tt"],
  desc: "Download TikTok videos",
  category: "downloads",
  filename: __filename,
  use: "<TikTok URL>",
}, async (conn, m, store, { from, args, q, reply }) => {
  try {
    if (!q || !q.startsWith("http")) {
      return reply("*`Please provide a valid TikTok link`*\n\nExample: `.tiktok https://www.tiktok.com/...`");
    }

    // Send loading message
    await conn.sendMessage(from, { text: "⏳ Please wait a moment, downloading your video..." }, { quoted: m });

    // Fetch TikTok video data
    const tiktokData = await tiktokdl(q);

    if (!tiktokData?.data?.play) {
      return reply("❌ Error: Could not retrieve the video.");
    }

    const videoURL = tiktokData.data.play;

    // Send the TikTok video
    await conn.sendMessage(from, {
      video: { url: videoURL },
      fileName: "tiktok.mp4",
      mimetype: "video/mp4",
      caption: "📥 *TikTok Video Downloaded*\n\n- *Power by 𝐀𝐍𝐃𝐑𝐄𝐖-𝐓𝐙🇹🇿*"
    }, { quoted: m });

    // Success reaction
    await conn.sendMessage(from, { react: { text: "✅", key: m.key } });

  } catch (error) {
    console.error(error);
    reply(`❌ An error occurred: ${error.message}`);
    await conn.sendMessage(from, { react: { text: "❌", key: m.key } });
  }
});

// TikTok download function
async function tiktokdl(url) {
  const apiUrl = `https://www.tikwm.com/api/?url=${url}?hd=1`;
  const response = await (await fetch(apiUrl)).json();
  return response;
}
