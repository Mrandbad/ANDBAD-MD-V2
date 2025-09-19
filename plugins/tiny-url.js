const { cmd } = require("../command");
const axios = require("axios");

cmd({
    pattern: "tiny",
    alias: ['short', 'shorturl'],
    react: "🫧",
    desc: "Makes URL tiny.",
    category: "convert",
    use: "<url>",
    filename: __filename,
},
async (conn, mek, m, { reply, args }) => {
    try {
        if (!args[0]) {
            return reply("*🏷️ Please provide me a valid link.*");
        }

        const link = args[0];
        if (!/^https?:\/\//i.test(link)) {
            return reply("*⚠️ Invalid URL. Please include http:// or https://*");
        }

        const response = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(link)}`);
        const shortenedUrl = response.data;

        return reply(`*🛡️ YOUR SHORTENED URL*\n\n${shortenedUrl}`);
    } catch (e) {
        console.error("Error shortening URL:", e.message);
        return reply("❌ An error occurred while shortening the URL. Please try again.");
    }
});
