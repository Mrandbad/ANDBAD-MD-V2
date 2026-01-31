module.exports = async (context) => {
  const { client, m } = context;

  const message = `
╭┈━〔 *🄵🄴🄴-🅇🄼🄳 Support Links* 〕━┈┈╮

> 👑 *Owner*  
https://wa.me/255752593977

> 📢 *Channel Link*  
https://whatsapp.com/channel/0029VbC9TRPCnA80RfS3Oi1V

> 👥 *Group*  
https://chat.whatsapp.com/DU79JfdnOI83ZFVAyD74Mo?mode=gi_t

╰━┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈━╯
> ©Powered by Andbadtz
`;

  try {
    await client.sendMessage(
      m.chat,
      { text: message },
      { quoted: m }
    );
  } catch (error) {
    console.error("Support command error:", error);
    await m.reply("⚠️ Failed to send support links. Please try again.");
  }
};