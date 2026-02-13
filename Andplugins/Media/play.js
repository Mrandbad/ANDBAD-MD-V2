const axios = require("axios");

module.exports = async (context) => {
    const { client, m, text } = context;

    if (!text) return m.reply("Are you mute? Give me a song name or YouTube link. It's not rocket science.");
    if (text.length > 200) return m.reply("Your search is longer than your attention span. Keep it under 200 characters.");

    try {
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });

        const searchQuery = text;
        const apiUrl = `https://api.privatezia.biz.id/api/downloader/ytplaymp3?query=${encodeURIComponent(searchQuery)}`;
        const response = await axios.get(apiUrl);
        const apiData = response.data;
        
        if (!apiData.status || !apiData.result || !apiData.result.downloadUrl) {
            throw new Error("The API spat out garbage. No audio for you.");
        }

        const audioUrl = apiData.result.downloadUrl;
        const title = apiData.result.title || "Untitled";
        const videoUrl = apiData.result.videoUrl;
        const thumbnail = apiData.result.thumbnail;

        await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

        await client.sendMessage(m.chat, {
            audio: { url: audioUrl },
            mimetype: "audio/mpeg",
            fileName: `${title.substring(0, 100)}.mp3`,
            contextInfo: {
                externalAdReply: {
                    title: title,
                    body: `ANDBADTZ Music`,
                    thumbnailUrl: thumbnail,
                    sourceUrl: videoUrl,
                    mediaType: 1,
                    renderLargerThumbnail: true,
                },
            },
        }, { quoted: m });

    } catch (error) {
        console.error(`Play error:`, error);
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        let userMessage = 'Download failed. The universe despises your music taste.';
        if (error.message.includes('API spat')) userMessage = 'The audio service rejected the request.';
        if (error.message.includes('timeout')) userMessage = 'Search timed out. Try a song that exists.';
        await m.reply(`${userMessage}\nError: ${error.message}`);
    }
};