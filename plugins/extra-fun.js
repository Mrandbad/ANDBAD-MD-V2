const { cmd } = require("../command");
const config = require('../config');

cmd({
  pattern: "compatibility",
  alias: ["friend", "fcheck"],
  desc: "Calculate the compatibility score between two users.",
  category: "fun",
  react: "💖",
  filename: __filename,
  use: "@tag1 @tag2",
}, async (conn, mek, m, { args, reply }) => {
  try {
    if (args.length < 2) {
      return reply("Please mention two users to calculate compatibility.\nUsage: `.compatibility @user1 @user2`");
    }

    let user1 = m.mentionedJid[0]; 
    let user2 = m.mentionedJid[1]; 

    const specialNumber = config.DEV ? `${config.DEV}@s.whatsapp.net` : null;

    // Calculate a random compatibility score (between 1 to 1000)
    let compatibilityScore = Math.floor(Math.random() * 1000) + 1;

    // Check if one of the mentioned users is the special number
    if (user1 === specialNumber || user2 === specialNumber) {
      compatibilityScore = 1000; // Special case for DEV number
      return reply(`💖 Compatibility between @${user1.split('@')[0]} and @${user2.split('@')[0]}: ${compatibilityScore}+/1000 💖`);
    }

    // Send the compatibility message
    await conn.sendMessage(mek.chat, {
      text: `💖 Compatibility between @${user1.split('@')[0]} and @${user2.split('@')[0]}: ${compatibilityScore}/1000 💖`,
      mentions: [user1, user2],
    }, { quoted: mek });

  } catch (error) {
    console.log(error);
    reply(`❌ Error: ${error.message}`);
  }
});

  cmd({
  pattern: "aura",
  desc: "Calculate aura score of a user.",
  category: "fun",
  react: "💀",
  filename: __filename,
  use: "@tag",
}, async (conn, mek, m, { args, reply }) => {
  try {
    if (args.length < 1) {
      return reply("Please mention a user to calculate their aura.\nUsage: `.aura @user`");
    }

    let user = m.mentionedJid[0]; 
    const specialNumber = config.DEV ? `${config.DEV}@s.whatsapp.net` : null;

    // Calculate a random aura score (between 1 to 1000)
    let auraScore = Math.floor(Math.random() * 1000) + 1;

    // Check if the mentioned user is the special number
    if (user === specialNumber) {
      auraScore = 999999; // Special case for DEV number
      return reply(`💀 Aura of @${user.split('@')[0]}: ${auraScore}+ 🗿`);
    }

    // Send the aura message
    await conn.sendMessage(mek.chat, {
      text: `💀 Aura of @${user.split('@')[0]}: ${auraScore}/1000 🗿`,
      mentions: [user],
    }, { quoted: mek });

  } catch (error) {
    console.log(error);
    reply(`❌ Error: ${error.message}`);
  }
});

cmd({
    pattern: "roast",
    desc: "Roast someone in Hindi",
    category: "fun",
    react: "🔥",
    filename: __filename,
    use: "@tag"
}, async (conn, mek, m, { q, reply }) => {
    let roasts = [
        "Abe bhai, tera IQ wifi signal se bhi kam hai!",
        "Bhai, teri soch WhatsApp status jaisi hai, 24 ghante baad gayab ho jaati hai!",
        "Abe sochta kitna hai, tu kya NASA ka scientist hai?",
        "Abe tu hai kaun? Google pe search karne se bhi tera naam nahi aata!",
        "Tera dimaag 2G network pe chal raha hai kya?",
        "Itna overthink mat kar bhai, teri battery jaldi down ho jayegi!",
        "Teri soch cricket ke match jaisi hai, baarish aate hi band ho jati hai!",
        "Tu VIP hai, 'Very Idiotic Person'!",
    "Abe bhai, tera IQ wifi signal se bhi kam hai!",
    "Bhai, teri soch WhatsApp status jaisi hai, 24 ghante baad gayab ho jaati hai!",
    "Abe tu kis planet se aaya hai, yeh duniya tere jaise aliens ke liye nahi hai!",
    "Tere dimag mein khojne ka itna kuch hai, lekin koi result nahi milta!",
    "Teri zindagi WhatsApp status jaisi hai, kabhi bhi delete ho sakti hai!",
    "Tera style bilkul WiFi password ki tarah hai, sabko pata nahi!",
    "Abe tu toh wahi hai jo apni zindagi ka plot twist bhi Google karta hai!",
    "Abe tu toh software update bhi nahi chalne wala, pura hang hai!",
    "Tere sochne se zyada toh Google search karne mein time waste ho jaata hai!",
    "Mere paas koi shabdon ki kami nahi hai, bas tujhe roast karne ka mood nahi tha!",
    "Teri personality toh dead battery jaisi hai, recharge karne ka time aa gaya hai!",
    "Bhai, teri soch ke liye ek dedicated server hona chahiye!",
    "Abe tu kaunsa game khel raha hai, jisme har baar fail ho jaata hai?",
    "Tere jokes bhi software update ki tarah hote hain, baar-baar lagte hain par kaam nahi karte!",
    "Teri wajah se toh mere phone ka storage bhi full ho jaata hai!",
    "Abe bhai, tu na ek walking meme ban gaya hai!",
    "Abe apne aap ko bada smart samajhta hai, par teri brain cells toh overload mein hain!",
    "Teri wajah se toh humari group chat ko mute karne ka sochna padta hai!",
    "Abe tere jaise log hamesha apne aap ko hero samajhte hain, par actually toh tum villain ho!",
    "Tere jaise logon ke liye zindagi mein rewind aur fast forward button hona chahiye!",
    "Tere mooh se nikla har lafz ek naya bug hai!",
    "Abe tu apni zindagi ke saath save nahi kar paaya, aur dusron ke liye advice de raha hai!",
    "Tu apne life ka sabse bada virus hai!",
    "Abe tu hain ya koi broken app?",
    "Tere soch ke liye CPU ki zarurat hai, par lagta hai tera CPU khatam ho gaya!",
    "Abe tu kya kar raha hai, ek walking error message ban gaya hai!",
    "Teri taareef toh bas lagti hai, par teri asli aukaat toh sabko pata hai!",
    "Tera brain toh ek broken link ki tarah hai, sab kuch dhundne ke bawajood kuch nahi milta!",
    "Bhai, tujhe dekh ke toh lagta hai, Netflix bhi teri wajah se crash ho gaya!",
    "Teri tasveer toh bas ek screenshot lagti hai, real life mein tu kuch bhi nahi!",
    "Abe bhai, tu lagta hai toh I-phone ho, lekin andar kaafi purana android hai!",
    "Abe, tere jaisi soch se toh Google bhi nafrat karta hoga!",
    "Bhai tu apne chehre se ghazab ka mood bana le, shayad koi notice kar le!",
    "Tere kaam bhi uss app ki tarah hote hain jo crash ho jata hai jab sabko zarurat ho!",
    "Teri zindagi ke sabse bada hack toh hai - 'Log mujhse kuch bhi expect mat karo'!",
    "Abe tu apne aap ko hi mirror mein dekh ke samajhta hai ki sab kuch sahi hai!",
    "Abe tu apne dimaag ko low power mode mein daalke chalta hai!",
    "Tere paas ideas hain, par sab outdated hain jaise Windows XP!",
    "Teri soch toh ek system error ki tarah hai, restart karna padega!",
    "Teri personality toh ek empty hard drive jaise hai, kuch bhi valuable nahi!", 
    "Abe tu kis planet se aaya hai, yeh duniya tere jaise logon ke liye nahi hai!",
    "Tere chehre pe kisi ne 'loading' likh diya hai, par kabhi bhi complete nahi hota!",
    "Tera dimaag toh ek broken link ki tarah hai, kabhi bhi connect nahi hota!",
    "Abe, teri soch se toh Google ka algorithm bhi confused ho jata hai!",
    "Tere jaisa banda, aur aise ideas? Yeh toh humne science fiction mein dekha tha!",
    "Abe tu apne chehre pe 'not found' likhwa le, kyunki sabko kuch milta nahi!",
    "Teri soch itni slow hai, Google bhi teri madad nahi kar paata!",
    "Abe tu toh '404 not found' ka living example hai!",
    "Tera dimaag bhi phone ki battery jaise hai, kabhi bhi drain ho jaata hai!",
    "Abe tu toh wahi hai, jo apni zindagi ka password bhool jaata hai!",
    "Abe tu jise apni soch samajhta hai, wo ek 'buffering' hai!",
    "Teri life ke decisions itne confusing hain, ki KBC ke host bhi haraan ho jaaye!",
    "Bhai, tere jaise logo ke liye ek dedicated 'error' page hona chahiye!",
    "Teri zindagi ko 'user not found' ka message mil gaya hai!",
    "Teri baatein utni hi value rakhti hain, jitni 90s ke mobile phones mein camera quality thi!",
    "Abe bhai, tu toh har waqt 'under construction' rehta hai!",
    "Tere saath toh life ka 'unknown error' hota hai, koi solution nahi milta!",
    "Bhai, tere chehre pe ek warning sign hona chahiye - 'Caution: Too much stupidity ahead'!",
    "Teri har baat pe lagta hai, system crash hone waala hai!",
    "Tere paas idea hai, par wo abhi bhi 'under review' hai!"
];               
        
    let randomRoast = roasts[Math.floor(Math.random() * roasts.length)];
    let sender = `@${mek.sender.split("@")[0]}`;
    let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);

    if (!mentionedUser) {
        return reply("Usage: .roast @user (Tag someone to roast them!)");
    }

    let target = `@${mentionedUser.split("@")[0]}`;
    
    // Sending the roast message with the mentioned user
    let message = `${target} :\n *${randomRoast}*\n> This is all for fun, don't take it seriously!`;
    await conn.sendMessage(mek.chat, { text: message, mentions: [mek.sender, mentionedUser] }, { quoted: mek });
});

cmd({
    pattern: "8ball",
    desc: "Magic 8-Ball gives answers",
    category: "fun",
    react: "🎱",
    filename: __filename
}, 
async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply("Ask a yes/no question! Example: .8ball Will I be rich?");
    
    let responses = [
        "Yes!", "No.", "Maybe...", "Definitely!", "Not sure.", 
        "Ask again later.", "I don't think so.", "Absolutely!", 
        "No way!", "Looks promising!"
    ];
    
    let answer = responses[Math.floor(Math.random() * responses.length)];
    
    reply(`🎱 *Magic 8-Ball says:* ${answer}`);
});

cmd({
    pattern: "compliment",
    desc: "Give a nice compliment",
    category: "fun",
    react: "😊",
    filename: __filename,
    use: "@tag (optional)"
}, async (conn, mek, m, { reply }) => {
    let compliments = [
        "You're amazing just the way you are! 💖",
        "You light up every room you walk into! 🌟",
        "Your smile is contagious! 😊",
        "You're a genius in your own way! 🧠",
        "You bring happiness to everyone around you! 🥰",
        "You're like a human sunshine! ☀️",
        "Your kindness makes the world a better place! ❤️",
        "You're unique and irreplaceable! ✨",
        "You're a great listener and a wonderful friend! 🤗",
        "Your positive vibes are truly inspiring! 💫",
        "You're stronger than you think! 💪",
        "Your creativity is beyond amazing! 🎨",
        "You make life more fun and interesting! 🎉",
        "Your energy is uplifting to everyone around you! 🔥",
        "You're a true leader, even if you don’t realize it! 🏆",
        "Your words have the power to make people smile! 😊",
        "You're so talented, and the world needs your skills! 🎭",
        "You're a walking masterpiece of awesomeness! 🎨",
        "You're proof that kindness still exists in the world! 💕",
        "You make even the hardest days feel a little brighter! ☀️"
    ];

    let randomCompliment = compliments[Math.floor(Math.random() * compliments.length)];
    let sender = `@${mek.sender.split("@")[0]}`;
    let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
    let target = mentionedUser ? `@${mentionedUser.split("@")[0]}` : "";

    let message = mentionedUser 
        ? `${sender} complimented ${target}:\n😊 *${randomCompliment}*`
        : `${sender}, you forgot to tag someone! But hey, here's a compliment for you:\n😊 *${randomCompliment}*`;

    await conn.sendMessage(mek.chat, { text: message, mentions: [mek.sender, mentionedUser].filter(Boolean) }, { quoted: mek });
});

cmd({
    pattern: "lovetest",
    desc: "Check love compatibility between two users",
    category: "fun",
    react: "❤️",
    filename: __filename,
    use: "@tag1 @tag2"
}, async (conn, mek, m, { args, reply }) => {
    if (args.length < 2) return reply("Tag two users! Example: .lovetest @user1 @user2");

    let user1 = args[0].replace("@", "") + "@s.whatsapp.net";
    let user2 = args[1].replace("@", "") + "@s.whatsapp.net";

    let lovePercent = Math.floor(Math.random() * 100) + 1; // Generates a number between 1-100

    let messages = [
        { range: [90, 100], text: "💖 *A match made in heaven!* True love exists!" },
        { range: [75, 89], text: "😍 *Strong connection!* This love is deep and meaningful." },
        { range: [50, 74], text: "😊 *Good compatibility!* You both can make it work." },
        { range: [30, 49], text: "🤔 *It’s complicated!* Needs effort, but possible!" },
        { range: [10, 29], text: "😅 *Not the best match!* Maybe try being just friends?" },
        { range: [1, 9], text: "💔 *Uh-oh!* This love is as real as a Bollywood breakup!" }
    ];

    let loveMessage = messages.find(msg => lovePercent >= msg.range[0] && lovePercent <= msg.range[1]).text;

    let message = `💘 *Love Compatibility Test* 💘\n\n❤️ *@${user1.split("@")[0]}* + *@${user2.split("@")[0]}* = *${lovePercent}%*\n${loveMessage}`;

    await conn.sendMessage(mek.chat, { text: message, mentions: [user1, user2] }, { quoted: mek });
}); 

cmd(
    {
        pattern: "emoji",
        desc: "Convert text into emoji form.",
        category: "fun",
        react: "🙂",
        filename: __filename,
        use: "<text>"
    },
    async (conn, mek, m, { args, q, reply }) => {
        try {
            // Join the words together in case the user enters multiple words
            let text = args.join(" ");
            
            // Map text to corresponding emoji characters
            let emojiMapping = {
                "a": "🅰️",
                "b": "🅱️",
                "c": "🇨️",
                "d": "🇩️",
                "e": "🇪️",
                "f": "🇫️",
                "g": "🇬️",
                "h": "🇭️",
                "i": "🇮️",
                "j": "🇯️",
                "k": "🇰️",
                "l": "🇱️",
                "m": "🇲️",
                "n": "🇳️",
                "o": "🅾️",
                "p": "🇵️",
                "q": "🇶️",
                "r": "🇷️",
                "s": "🇸️",
                "t": "🇹️",
                "u": "🇺️",
                "v": "🇻️",
                "w": "🇼️",
                "x": "🇽️",
                "y": "🇾️",
                "z": "🇿️",
                "0": "0️⃣",
                "1": "1️⃣",
                "2": "2️⃣",
                "3": "3️⃣",
                "4": "4️⃣",
                "5": "5️⃣",
                "6": "6️⃣",
                "7": "7️⃣",
                "8": "8️⃣",
                "9": "9️⃣",
                " ": "␣", // for space
            };

            // Convert the input text into emoji form
            let emojiText = text.toLowerCase().split("").map(char => emojiMapping[char] || char).join("");

            // If no valid text is provided
            if (!text) {
                return reply("Please provide some text to convert into emojis!");
            }

            await conn.sendMessage(mek.chat, {
                text: emojiText,
            }, { quoted: mek });

        } catch (error) {
            console.log(error);
            reply(`Error: ${error.message}`);
        }
    }
);
