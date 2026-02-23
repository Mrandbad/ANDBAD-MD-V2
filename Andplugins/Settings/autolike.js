const { getSettings, updateSetting } = require('../../Database/config');
const ownerMiddleware = require('../../utility/botUtil/Ownermiddleware');

module.exports = async (context) => {
  await ownerMiddleware(context, async () => {
    const { client, m, args, prefix } = context;

    const formatStylishReply = (message) => {
      return `❥┈┈┈┈┈┈┈┈┈┈┈┈┈┈➤\n│❥ ${message}\n❥┈┈┈┈┈┈┈┈┈┈┈┈┈┈➤`;
    };

    try {
      const settings = await getSettings();
      if (!settings || Object.keys(settings).length === 0) {
        return await client.sendMessage(
          m.chat,
          { text: formatStylishReply("Database is fucked, no settings found. Fix it, loser.") },
          { quoted: m, ad: true }
        );
      }

      const value = args.join(" ").toLowerCase();

      if (value === 'on' || value === 'off') {
        const action = value === 'on';
        if (settings.autolike === action) {
          return await client.sendMessage(
            m.chat,
            { text: formatStylishReply(`Autolike’s already ${value.toUpperCase()}, genius. Stop wasting my time.`) },
            { quoted: m, ad: true }
          );
        }

        await updateSetting('autolike', action);
        return await client.sendMessage(
          m.chat,
          { text: formatStylishReply(`Autolike ${value.toUpperCase()} activated! 🔥 ${action ? 'Bot’s gonna like statuses like a simp.' : 'No more fake love for statuses.'}`) },
          { quoted: m, ad: true }
        );
      }

      const buttons = [
        { buttonId: `${prefix}autolike on`, buttonText: { displayText: "ON 🥶" }, type: 1 },
        { buttonId: `${prefix}autolike off`, buttonText: { displayText: "OFF 😴" }, type: 1 },
      ];

      await client.sendMessage(
        m.chat,
        {
          text: formatStylishReply(`Autolike’s ${settings.autolike ? 'ON 🥶' : 'OFF 😴'}, dumbass. Pick a vibe, noob! 😈`),
          footer: "> 𝖢𝗋𝖾𝖺𝗍𝖾𝖽 𝖻𝗒 ✦𝗔𝗻𝗱𝗯𝗱𝗧𝗭✦",
          buttons,
          headerType: 1,
          viewOnce: true,
        },
        { quoted: m, ad: true }
      );
    } catch (error) {
      await client.sendMessage(
        m.chat,
        { text: formatStylishReply("Shit broke, couldn’t mess with autolike. Database or something’s fucked. Try later.") },
        { quoted: m, ad: true }
      );
    }
  });
};
