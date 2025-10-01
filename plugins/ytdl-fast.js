const fetch = require("node-fetch");
const yts = require("yt-search");
const { cmd } = require("../command");

const youtubeRegexID = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/;

// ===== PLAY / YT DOWNLOAD PLUGIN =====
cmd({
    pattern: "play",
    alias: ["yta", "ytmp3", "playaudio", "play2", "ytv", "ytmp4", "mp4"],
    react: "🎶",
    desc: "Play or download YouTube songs and videos.",
    category: "downloads",
    use: ".play <song name / YouTube link>",
    filename: __filename
},
async (conn, mek, m, { from, q, command, reply }) => {
    try {
        if (!q) return reply("❀ Please enter the name of the music or a YouTube link.");

        // Detect YouTube ID from URL
        let videoIdToFind = q.match(youtubeRegexID) || null;
        let ytResult = await yts(videoIdToFind === null ? q : `https://youtu.be/${videoIdToFind[1]}`);

        // Pick correct video
        if (videoIdToFind) {
            const videoId = videoIdToFind[1];
            ytResult = ytResult.all.find(item => item.videoId === videoId) || ytResult.videos.find(item => item.videoId === videoId);
        }
        ytResult = ytResult.all?.[0] || ytResult.videos?.[0] || ytResult;

        if (!ytResult || ytResult.length === 0) return reply("✧ No results found for your search.");

        let { title, thumbnail, timestamp, views, ago, url, author } = ytResult;
        const channel = author?.name || "Unknown";

        const formattedViews = formatViews(views);
        const infoMessage = `
「✦」Downloading *${title || "Unknown"}*

> ✧ Channel   » *${channel}*
> ✰ Views     » *${formattedViews || "Unknown"}*
> ⴵ Duration  » *${timestamp || "Unknown"}*
> ✐ Published » *${ago || "Unknown"}*
> 🜸 Link      » ${url}
        `.trim();

        // Send info preview with externalAdReply
        await conn.sendMessage(from, {
            text: infoMessage,
            contextInfo: {
                externalAdReply: {
                    title: "ANDBAD-MD Player",
                    body: "Powered by Andbad Organisation",
                    mediaType: 1,
                    sourceUrl: url,
                    thumbnailUrl: thumbnail,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: mek });

       // Handle Audio
if (["play", "yta", "ytmp3", "playaudio"].includes(command)) {
    // List of audio APIs
    const audioAPIs = [
        `https://apis.davidcyriltech.my.id/youtube/mp3?url=${url}`,
        `https://api.ryzendesu.vip/api/downloader/ytmp3?url=${url}`,
        `https://api.vreden.my.id/api/ytmp3?url=${url}`,
        `https://api.neoxr.eu/api/youtube?url=${url}&type=audio&apikey=GataDios`
    ];

    let result = null;

    for (const apiUrl of audioAPIs) {
        try {
            const apiResponse = await (await fetch(apiUrl)).json();
            // Try different result paths depending on API structure
            result = apiResponse?.result?.download?.url || apiResponse?.data?.url;
            if (result) break; // Stop loop if we got a valid audio link
        } catch (err) {
            console.log(`Audio API failed: ${apiUrl}`, err.message);
            continue; // Try next API
        }
    }

    if (!result) return reply("⚠︎ Could not fetch audio from any API. Try again later.");

    await conn.sendMessage(from, {
        audio: { url: result },
        fileName: `${ytResult.title || "audio"}.mp3`,
        mimetype: "audio/mpeg"
    }, { quoted: mek });
}


        // Handle Video
        else if (["play2", "ytv", "ytmp4", "mp4"].includes(command)) {
            try {
                const response = await fetch(`https://api.neoxr.eu/api/youtube?url=${url}&type=video&quality=480p&apikey=GataDios`);
                const json = await response.json();

                if (!json?.data?.url) throw new Error("⚠ Failed to fetch video link.");

                await conn.sendMessage(from, {
                    video: { url: json.data.url },
                    caption: title
                }, { quoted: mek });
            } catch (e) {
                return reply("⚠︎ Could not send the video. Try again later.");
            }
        }

    } catch (error) {
        console.error(error);
        return reply(`⚠︎ An error occurred: ${error.message}`);
    }
});

// ===== Function to format view counts =====
function formatViews(views) {
    if (!views) return "Unknown";

    if (views >= 1_000_000_000) return `${(views / 1_000_000_000).toFixed(1)}B (${views.toLocaleString()})`;
    if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M (${views.toLocaleString()})`;
    if (views >= 1_000) return `${(views / 1_000).toFixed(1)}K (${views.toLocaleString()})`;

    return views.toString();
}