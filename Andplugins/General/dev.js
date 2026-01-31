const { getSettings } = require('../../Database/config');

module.exports = {
  name: 'dev',
  aliases: ['developer', 'contact'],
  description: 'Sends the developer\'s contact as a vCard',
  run: async (context) => {
    const { client, m } = context;

    try {
      const settings = await getSettings();
      if (!settings) {
        await client.sendMessage(m.chat, { text: `❥┈┈┈┈┈┈┈┈┈┈┈┈┈┈➤\n┋✿ Error: Couldn't load settings.` }, { quoted: m });
        return;
      }

      const devContact = {
        phoneNumber: '255782305254',
        fullName: 'Mrandbad Dev'
      };

      const vcard = 'BEGIN:VCARD\n' 
                  + 'VERSION:3.0\n' 
                  + 'FN:' + devContact.fullName + '\n' 
                  + 'ORG:ANDBAD-MD;\n' 
                  + 'TEL;type=CELL;type=VOICE;waid=' + devContact.phoneNumber + ':+' + devContact.phoneNumber + '\n' 
                  + 'END:VCARD';

      await client.sendMessage(m.chat, {
        contacts: {
          displayName: 'Mrandbad Dev',
          contacts: [{ vcard }]
        }
      }, { quoted: m });

    } catch (error) {
      console.error('Error sending developer contact:', error);
      await client.sendMessage(m.chat, {
        text: `Oops! Something went wrong. Try again later.`
      }, { quoted: m });
    }
  }
};