module.exports = async (context) => {
  const { client, m } = context;

  const message = `
╭┈━〔 *𝐀𝐍𝐃𝐁𝐀𝐃-𝐌𝐃 𝑠𝑢𝑝𝑝𝑜𝑟𝑡 𝑙𝑖𝑛𝑘* 〕━┈┈╮

> 👑 *𝑜𝑤𝑛𝑒𝑟*  
https://wa.me/255782305254 

> 📢 *𝑐ℎ𝑎𝑛𝑛𝑒𝑙 𝑙𝑖𝑛𝑘*  
https://whatsapp.com/channel/0029VbC9TRPCnA80RfS3Oi1V

> 👥 *𝑔𝑟𝑜𝑢𝑝*  
https://chat.whatsapp.com/DU79JfdnOI83ZFVAyD74Mo?mode=gi_t

╰━┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈━╯
> ©Powered by 𝐀𝐍𝐃𝐁𝐀𝐃𝐓𝐙🇹🇿
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
