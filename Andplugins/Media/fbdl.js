const fetch = require("node-fetch");

module.exports = async (context) => {
    const { client, m, text, prefix } = context;

    if (!text) {
        return m.reply(`You brainless moron, where's the Facebook link?\nExample: ${prefix}facebook https://www.facebook.com/reel/xxxxx`);
    }

    if (!text.includes("facebook.com")) {
        return m.reply("Are you fucking blind? That's not a Facebook link! Facebook links contain 'facebook.com', you absolute potato.");
    }

    try {
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });

        const encodedUrl = encodeURIComponent(text.trim());
        const apiUrl = `https://vinztyty.my.id/download/facebook?url=${encodedUrl}`;

        const response = await fetch(apiUrl);
        const data = await response.json();

        if (!data.status || !data.result || data.result.length === 0) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
            return m.reply("No video found or API failed. Try another link!");
        }

        const videos = data.result;
        let video720p = null;
        let bestVideo = null;

        for (const video of videos) {
            if (video.quality && video.quality.includes("720p") && video.url && video.url !== "/") {
                video720p = video;
                break;
            }
            if (video.url && video.url !== "/" && !bestVideo) {
                bestVideo = video;
            }
        }

        const videoToUse = video720p || bestVideo;

        if (!videoToUse || !videoToUse.url || videoToUse.url === "/") {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
            return m.reply("Failed to get a valid video URL. The link might be private or restricted.");
        }

        await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

        await client.sendMessage(
            m.chat,
            {
                video: { url: videoToUse.url },
                caption: `Here's your Facebook video in ${videoToUse.quality || "best available quality"}.\nDon't waste my time with more garbage.`,
                gifPlayback: false
            },
            { quoted: m }
        );

    } catch (e) {
        console.error("Facebook DL Error:", e);
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        m.reply(`Facebook download crashed harder than your IQ.\nError: ${e.message}\nTry again or go touch grass.`);
    }
};