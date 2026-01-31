
module.exports = {
  name: 'checkid',
  aliases: ['cekid', 'getid', 'id'],
  description: 'Get the JID of a WhatsApp group or channel from its invite link',
  run: async (context) => {
    const { client, m, prefix } = context;

    try {
      const text = m.body.trim();
      const linkMatch = text.match(/https?:\/\/(chat\.whatsapp\.com|whatsapp\.com\/channel)\/[^\s]+/i);
      const link = linkMatch ? linkMatch[0] : null;

      if (!link) {
        return m.reply(`Where's the link, you brainless ape?\nExample: ${prefix}checkid https://chat.whatsapp.com/xxxxx`);
      }

      await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });

      let url;
      try {
        url = new URL(link);
      } catch {
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        return m.reply("That's not even a valid URL. Are you trying to break my code on purpose?");
      }

      if (url.hostname === 'chat.whatsapp.com' && /^\/[A-Za-z0-9]{20,}$/.test(url.pathname)) {
        const code = url.pathname.replace(/^\/+/, '');
        const res = await client.groupGetInviteInfo(code);
        const id = res.id;
        
        await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
        
        await client.sendMessage(m.chat, {
          interactiveMessage: {
            header: `📊 *Group Link Analysis*\n\n🔗 *Link:* ${link}\n📌 *Invite Code:* \`${code}\`\n\n*Group ID:* \`${id}\``,
            footer: "> Powered by Andbadtz",
            buttons: [
              {
                name: "cta_copy",
                buttonParamsJson: JSON.stringify({
                  display_text: "📋 Copy Group ID",
                  copy_code: id
                })
              }
            ]
          }
        }, { quoted: m });

      }
      else if (url.hostname === 'whatsapp.com' && url.pathname.startsWith('/channel/')) {
        const code = url.pathname.split('/channel/')[1]?.split('/')[0];
        if (!code) {
          await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
          return m.reply("Invalid channel link format");
        }
        
        const res = await client.newsletterMetadata('invite', code, 'GUEST');
        const id = res.id;
        
        await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
        
        await client.sendMessage(m.chat, {
          interactiveMessage: {
            header: `📢 *Channel Link Analysis*\n\n🔗 *Link:* ${link}\n📌 *Channel Code:* \`${code}\`\n\n*Channel ID:* \`${id}\``,
            footer: "> Powered by Andbadtz",
            buttons: [
              {
                name: "cta_copy",
                buttonParamsJson: JSON.stringify({
                  display_text: " Copy Channel ID",
                  copy_code: id
                })
              }
            ]
          }
        }, { quoted: m });

      }
      else {
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        return m.reply("That's not a WhatsApp group or channel link. Are you blind or just stupid?");
      }

    } catch (error) {
      console.error('CheckID command error:', error);
      await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
      await m.reply(`CheckID command crashed.\nError: ${error.message}\nThe link is probably fake or expired.`);
    }
  }
};