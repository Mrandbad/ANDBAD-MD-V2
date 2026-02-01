const { getSettings, getGroupSetting, updateGroupSetting } = require('../../Database/config');
const ownerMiddleware = require('../../utility/botUtil/Ownermiddleware');

module.exports = async (context) => {
  await ownerMiddleware(context, async () => {
    const { m, args } = context;
    const value = args[0]?.toLowerCase();
    const jid = m.chat;

    if (!jid.endsWith('@g.us')) {
      return await m.reply(
        `❥┈┈┈┈┈┈┈┈┈┈┈┈┈┈➤\n` +
        `│❥ Epic fail, loser! 😈\n` +
        `│❥ This command is for groups only, moron!\n` +
        `❥┈┈┈┈┈┈┈┈┈┈┈┈┈┈➤`
      );
    }

    const settings = await getSettings();
    const prefix = settings.prefix;

    let groupSettings = await getGroupSetting(jid);
    let isEnabled = groupSettings?.antidemote === true;

    if (value === 'on' || value === 'off') {
      const action = value === 'on';

      if (isEnabled === action) {
        return await m.reply(
          `❥┈┈┈┈┈┈┈┈┈┈┈┈┈┈➤\n` +
          `│❥ Antidemote is already ${value.toUpperCase()}, you brainless fool! 🥶\n` +
          `│❥ Quit wasting my time! 🖕\n` +
          `❥┈┈┈┈┈┈┈┈┈┈┈┈┈┈➤`
        );
      }

      await updateGroupSetting(jid, 'antidemote', action ? 'true' : 'false');
      await m.reply(
        `❥┈┈┈┈┈┈┈┈┈┈┈┈┈┈➤\n` +
        `│❥ Antidemote ${value.toUpperCase()}! 🔥\n` +
        `│❥ Demotions are under my watch, king! 😈\n` +
        `❥┈┈┈┈┈┈┈┈┈┈┈┈┈┈➤`
      );
    } else {
      await m.reply(
        `❥┈┈┈┈┈┈┈┈┈┈┈┈┈┈➤\n` +
        `│❥ Antidemote Status: ${isEnabled ? 'ON 🥶' : 'OFF 😴'}\n` +
        `│❥ Use "${prefix}antidemote on" or "${prefix}antidemote off", peasant!\n` +
        `❥┈┈┈┈┈┈┈┈┈┈┈┈┈┈➤`
      );
    }
  });
};