const config = require('../config');
const { cmd } = require('../command');
const yts = require('yt-search');
const fetch = require('node-fetch');

cmd({
    pattern: "video2",
    alias: ["mp4", "song"],
    react: "🎥",
    desc: "Download video from YouTube",
    category: "download",
    use: ".video <query or url>",
    filename: __filename
}, async (conn, m, mek, { from, q, reply }) => {
    try {
        if (!q) return await reply("❌ Please provide a video name or YouTube URL!");

        let videoUrl, title;

        // Check if query is a YouTube URL
        const isUrl = /(youtube\.com|youtu\.be)/.test(q);
        if (isUrl) {
            videoUrl = q;
            // Search by URL to get video info
            const searchResult = await yts(q);
            if (!searchResult.videos.length) return await reply("❌ Video not found!");
            title = searchResult.videos[0].title;
        } else {
            // Search YouTube by query
            const searchResult = await yts(q);
            if (!searchResult.videos.length) return await reply("❌ No results found!");
            videoUrl = searchResult.videos[0].url;
            title = searchResult.videos[0].title;
        }

        await reply("⏳ Downloading video...");

        // Use API to get video download link
        const apiUrl = `https://apis.davidcyriltech.my.id/download/ytmp4?url=${encodeURIComponent(videoUrl)}`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (!data.success || !data.result?.download_url) {
            return await reply("❌ Failed to get video download URL!");
        }

        // Send video
        await conn.sendMessage(from, {
            video: { url: data.result.download_url },
            mimetype: 'video/mp4',
            caption: `🎬 *${title}*`
        }, { quoted: mek });

        await reply(`✅ *${title}* downloaded successfully!`);

    } catch (error) {
        console.error(error);
        await reply(`❌ Error: ${error.message || "Unknown error"}`);
    }
});
