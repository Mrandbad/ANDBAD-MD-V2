const config = require('../config');
const { cmd } = require('../command');
const DY_SCRAP = require('@dark-yasiya/scrap');
const dy_scrap = new DY_SCRAP();

function replaceYouTubeID(url) {
    const regex = /(?:youtube\.com\/(?:.*v=|.*\/)|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

cmd({
    pattern: "play3",
    alias: ["mp3", "ytmp3"],
    react: "🎵",
    desc: "Download YT as MP3",
    category: "download",
    use: ".song <Text or YT URL>",
    filename: __filename
}, async (conn, m, mek, { from, q, reply }) => {
    try {
        if (!q) return await reply("❌ Please provide a query or YouTube URL!");

        let id = q.startsWith("https://") ? replaceYouTubeID(q) : null;

        if (!id) {
            const searchResults = await dy_scrap.ytsearch(q);
            if (!searchResults?.results?.length) return await reply("❌ No results found!");
            id = searchResults.results[0].videoId;
        }

        const data = await dy_scrap.ytsearch(`https://youtube.com/watch?v=${id}`);
        if (!data?.results?.length) return await reply("❌ Failed to fetch video!");

        const song = data.results[0]; // Correctly define song
        const { url, title, image, timestamp, ago, views, author, downloadUrl } = song;

        let info = `🍄 *SONG DOWNLOADER* 🍄\n\n` +
            `🎵 *Title:* ${title || "Unknown"}\n` +
            `⏳ *Duration:* ${timestamp || "Unknown"}\n` +
            `👀 *Views:* ${views || "Unknown"}\n` +
            `🌏 *Release Ago:* ${ago || "Unknown"}\n` +
            `👤 *Author:* ${author?.name || "Unknown"}\n` +
            `🖇 *Url:* ${url || "Unknown"}\n\n` +
            `🔽 *Reply with your choice:*\n` +
            `1.1 *Audio Type* 🎵\n` +
            `1.2 *Document Type* 📁\n\n` +
            `${config.FOOTER || "𓆩andbad𓆪"}`;

        // Send thumbnail + info
        await conn.sendMessage(from, { image: { url: image }, caption: info }, { quoted: mek });

        // Send audio
        await conn.sendMessage(from, {
            audio: { url: downloadUrl },
            mimetype: "audio/mpeg",
            fileName: `${title}.mp3`,
            contextInfo: {
                externalAdReply: {
                    title: title.length > 25 ? `${title.substring(0, 22)}...` : title,
                    body: "Follow our WhatsApp Channel",
                    mediaType: 1,
                    thumbnailUrl: image,
                    sourceUrl: 'https://whatsapp.com/channel/0029VajQn6YF1YlPE0XgBC2m',
                    mediaUrl: 'https://whatsapp.com/channel/0029VajQn6YF1YlPE0XgBC2m',
                    showAdAttribution: true,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: mek });

    } catch (error) {
        console.error(error);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        await reply(`❌ *An error occurred:* ${error.message || "Unknown error"}`);
    }
});
