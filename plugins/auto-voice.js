const axios = require('axios');
const config = require("../config");
const { cmd } = require("../command");

cmd({ on: "body" }, async (conn, m, msg, { from, body }) => {
  try {
    const jsonUrl = "https://raw.githubusercontent.com/criss-vevo/CRISS-DATA/main/autovoice.json";
    const res = await axios.get(jsonUrl);
    const voiceMap = res.data;

    for (const keyword in voiceMap) {
      if (body.toLowerCase() === keyword.toLowerCase()) {
        if (config.AUTO_VOICE === "true") {
          const audioUrl = voiceMap[keyword];

          // Ensure it's a .mp3 or .m4a file
          if (!audioUrl.endsWith(".mp3") && !audioUrl.endsWith(".m4a")) {
            return conn.sendMessage(from, { text: "Invalid audio format. Only .mp3 and .m4a supported." }, { quoted: m });
          }

          await conn.sendPresenceUpdate("recording", from);
          await conn.sendMessage(from, {
            audio: { url: audioUrl },
            mimetype: "audio/mpeg", // This works fine for .mp3 and .m4a
            ptt: true
          }, { quoted: m });
        }
      }
    }
  } catch (e) {
    console.error("AutoVoice error:", e);
    return conn.sendMessage(from, { text: "Error fetching voice: " + e.message }, { quoted: m });
  }
});
