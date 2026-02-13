const fetch = require("node-fetch");

module.exports = async (context) => {
    const { client, m, text, prefix } = context;

    try {
        if (!text) return m.reply(`Did you forget your brain at home? Where's the TikTok link?\nExample: ${prefix}tt https://vt.tiktok.com/xxxxx`);
        if (!text.includes("tiktok.com")) return m.reply("Are you fucking blind? That's not a TikTok link! TikTok links contain 'tiktok.com', you absolute potato.");

        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });

        const encodedUrl = encodeURIComponent(text);
        const response = await fetch(`https://api.offmonprst.my.id/api/tiktok?url=${encodedUrl}`);
        const data = await response.json();

        if (!data?.result?.status || (!data?.result?.nowm && !data?.result?.hd)) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
            return m.reply("Failed to download that garbage TikTok! Either the link is dead or your taste in content is so bad even the API rejected it.");
        }

        const videoUrl = data.result.hd || data.result.nowm;
        const username = data.result.name || "Unknown";
        
        await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

        const videoResponse = await fetch(videoUrl);
        const videoArrayBuffer = await videoResponse.arrayBuffer();
        const videoBuffer = Buffer.from(videoArrayBuffer);

        await client.sendMessage(m.chat, {
            video: videoBuffer,
            mimetype: "video/mp4",
            caption: `@${username}\n\nHere's your braindead TikTok video. Don't waste my time with more garbage.`
        }, { quoted: m });

        await new Promise(resolve => setTimeout(resolve, 1000));

        const audioUrl = videoUrl.replace(/\.mp4$/, '.mp3');
        try {
            const audioResponse = await fetch(videoUrl);
            const audioArrayBuffer = await audioResponse.arrayBuffer();
            const audioBuffer = Buffer.from(audioArrayBuffer);
            
            await client.sendMessage(m.chat, {
                audio: audioBuffer,
                mimetype: "audio/mpeg",
                ptt: false,
                fileName: `tiktok_${Date.now()}.mp3`,
                caption: `Audio version of that TikTok trash.`
            });
        } catch (audioError) {
            console.log("Audio extraction failed, sending video only:", audioError.message);
        }

    } catch (error) {
        console.error("TikTok error:", error);
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        await m.reply(`The fuck? TikTok download crashed harder than your IQ.\nError: ${error.message}\nTry again or go touch grass.`);
    }
};