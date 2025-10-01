const {
  cmd
} = require('../command');
const config = require("../config");
cmd({
  'on': "body"
}, async (_0x4be391, _0x2bbd0c, _0x558f90, {
  from: _0x529db2,
  body: _0x572277,
  isGroup: _0xffba41,
  isAdmins: _0x5e74ad,
  isBotAdmins: _0x26676b,
  reply: _0x53a5ce,
  sender: _0x3dfc05
}) => {
  try {
    const _0x3b3c8f = ["wtf", "mia", "xxx", "fuck", 'sex', "huththa", "pakaya", 'ponnaya', "hutto"];
    if (!_0xffba41 || _0x5e74ad || !_0x26676b) {
      return;
    }
    const _0x157c8a = _0x572277.toLowerCase();
    const _0x371867 = _0x3b3c8f.some(_0x2e3bd4 => _0x157c8a.includes(_0x2e3bd4));
    if (_0x371867 & config.ANTI_BAD_WORD === "true") {
      await _0x4be391.sendMessage(_0x529db2, {
        'delete': _0x2bbd0c.key
      }, {
        'quoted': _0x2bbd0c
      });
      await _0x4be391.sendMessage(_0x529db2, {
        'text': "🚫 ⚠️💎 Sɪʟᴠᴀ Sᴘᴀʀᴋ MD 💎 BAD WORDS NOT ALLOWED⚠️ 🚫"
      }, {
        'quoted': _0x2bbd0c
      });
    }
  } catch (_0x47eee8) {
    console.error(_0x47eee8);
    _0x53a5ce("An error occurred while processing the message.");
  }
});
const linkPatterns = [/https?:\/\/(?:chat\.whatsapp\.com|wa\.me)\/\S+/gi, /^https?:\/\/(www\.)?whatsapp\.com\/channel\/([a-zA-Z0-9_-]+)$/, /wa\.me\/\S+/gi, /https?:\/\/(?:t\.me|telegram\.me)\/\S+/gi, /https?:\/\/(?:www\.)?youtube\.com\/\S+/gi, /https?:\/\/youtu\.be\/\S+/gi, /https?:\/\/(?:www\.)?facebook\.com\/\S+/gi, /https?:\/\/fb\.me\/\S+/gi, /https?:\/\/(?:www\.)?instagram\.com\/\S+/gi, /https?:\/\/(?:www\.)?twitter\.com\/\S+/gi, /https?:\/\/(?:www\.)?tiktok\.com\/\S+/gi, /https?:\/\/(?:www\.)?linkedin\.com\/\S+/gi, /https?:\/\/(?:www\.)?snapchat\.com\/\S+/gi, /https?:\/\/(?:www\.)?pinterest\.com\/\S+/gi, /https?:\/\/(?:www\.)?reddit\.com\/\S+/gi, /https?:\/\/ngl\/\S+/gi, /https?:\/\/(?:www\.)?discord\.com\/\S+/gi, /https?:\/\/(?:www\.)?twitch\.tv\/\S+/gi, /https?:\/\/(?:www\.)?vimeo\.com\/\S+/gi, /https?:\/\/(?:www\.)?dailymotion\.com\/\S+/gi, /https?:\/\/(?:www\.)?medium\.com\/\S+/gi];
cmd({
  'on': "body"
}, async (_0x488fe3, _0x4807fa, _0x524921, {
  from: _0x49635a,
  body: _0x3c0765,
  sender: _0x36e9e2,
  isGroup: _0x5cc616,
  isAdmins: _0x4f15b6,
  isBotAdmins: _0x148963,
  reply: _0x3855a2
}) => {
  try {
    if (!_0x5cc616 || _0x4f15b6 || !_0x148963) {
      return;
    }
    const _0x58c73c = linkPatterns.some(_0x332817 => _0x332817.test(_0x3c0765));
    if (_0x58c73c && config.ANTI_LINK === 'true') {
      await _0x488fe3.sendMessage(_0x49635a, {
        'delete': _0x4807fa.key
      }, {
        'quoted': _0x4807fa
      });
      await _0x488fe3.sendMessage(_0x49635a, {
        'text': "⚠️💎  💎 Links are not allowed in this group.\n@" + _0x36e9e2.split('@')[0x0] + " has been removed. 🚫",
        'mentions': [_0x36e9e2]
      }, {
        'quoted': _0x4807fa
      });
      await _0x488fe3.groupParticipantsUpdate(_0x49635a, [_0x36e9e2], "remove");
    }
  } catch (_0x2e5577) {
    console.error(_0x2e5577);
    _0x3855a2("An error occurred while processing the message.");
  }
});