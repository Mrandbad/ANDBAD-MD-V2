const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "ytsearch",
    alias: ["ytfind", "yts"],
    desc: "Search YouTube videos",
    category: "downloader",
    react: "🔍",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
    try {
        if (!q) return reply("Please provide a search query.\nExample: `.ytsearch music`");

        const apiUrl = `https://silva-ytapi.onrender.com/api/download/search?q=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);

        if (!data || !data.status || !data.results || data.results.length === 0) {
            await react("❌");
            return reply("No results found for your query.");
        }

        let caption = `🔎 *YouTube Search Results for:* ${q}\n\n`;

        // Show top 5 results only
        const results = data.results.slice(0, 5);
        for (let i = 0; i < results.length; i++) {
            caption += `🎬 *${i + 1}. ${results[i].title}*\n` +
                       `📺 Channel: ${results[i].channel}\n` +
                       `⏱ Duration: ${results[i].duration}\n` +
                       `🔗 Link: ${results[i].url}\n\n`;
        }

        caption += `━━━━━━━━━━━━━━\n⚡ Powered by Silva YTSearch API`;

        await conn.sendMessage(from, { text: caption }, { quoted: mek });
        await react("✅");

    } catch (e) {
        console.error("Error in ytsearch command:", e);
        await react("❌");
        reply("An error occurred while searching YouTube.");
    }
});
