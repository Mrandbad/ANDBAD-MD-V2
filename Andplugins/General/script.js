module.exports = async (context) => {
    const { client, m, text, botname, prefix = '' } = context;

    if (text) {
        return client.sendMessage(
            m.chat,
            { text: `Hello ${m.pushName}, just use the command ${prefix}repo to get the repository source code.` },
            { quoted: m }
        );
    }

    try {
        const repoUrl = 'https://api.github.com/repos/Mrandbad/ANDBAD-MD-V2';
        const response = await fetch(repoUrl);
        const repoData = await response.json();

        if (!response.ok) {
            throw new Error('Failed to fetch repository data');
        }

        const createdDate = new Date(repoData.created_at).toLocaleDateString('en-GB');
        const lastUpdateDate = new Date(repoData.updated_at).toLocaleDateString('en-GB');

               const replyText = 
            `╭─❥「❀ 𝙍𝙚𝙥𝙤𝙨𝙞𝙩𝙤𝙧𝙮 𝙄𝙣𝙛𝙤 ❀」\n┃\n` +
            `┃ ✿ 𝙎𝙩𝙖𝙧𝙨: ${repoData.stargazers_count}\n` +
            `┃ ✿ 𝙁𝙤𝙧𝙠𝙨: ${repoData.forks_count}\n` +
            `┃ ✿ 𝘾𝙧𝙚𝙖𝙩𝙚𝙙: ${createdDate}\n` +
            `┃ ✿ 𝙇𝙖𝙨𝙩 𝙐𝙥𝙙𝙖𝙩𝙚: ${lastUpdateDate}\n` +
            `┃ ✿ 𝙊𝙬𝙣𝙚𝙧: ${repoData.owner.login}\n┃\n` +
            `❥┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈➤\n\n` +
            `🎀 𝙎𝙚𝙡𝙚𝙘𝙩 𝙖𝙣 𝙤𝙥𝙩𝙞𝙤𝙣 𝙗𝙚𝙡𝙤𝙬 ✨`;

        await client.sendMessage(
            m.chat,
            {
                interactiveMessage: {
                    header: `*${botname}*`,
                    title: replyText,
                    footer: `Powered by 𝗔𝗻𝗱𝗯𝗮𝗱𝗧𝗭`,
                    buttons: [
                        // Row 1
                        {
                            name: 'cta_url',
                            buttonParamsJson: JSON.stringify({
                                display_text: '📂 𝙎𝙤𝙪𝙧𝙘𝙚 𝙍𝙚𝙥𝙤',
                                url: 'https://github.com/Mrandbad/ANDBAD-MD-V2'
                            })
                        },
                        {
                            name: 'cta_url',
                            buttonParamsJson: JSON.stringify({
                                display_text: '🌐 𝙑𝙞𝙨𝙞𝙩 𝗬𝗼𝘂𝘁𝘂𝗯𝗲 𝗰𝗵𝗮𝗻𝗻𝗲𝗹',
                                url: 'https://www.youtube.com/@andbadtz'
                            })
                        },
                        // Row 2
                        {
                            name: 'cta_url',
                            buttonParamsJson: JSON.stringify({
                                display_text: '📱 𝘿𝙤𝙬𝙣𝙡𝙤𝙖𝙙 𝘼𝙥𝙠',
                                url: 'https://files.catbox.moe/9r77s0.apk'
                            })
                        },
                        {
                            name: 'cta_url',
                            buttonParamsJson: JSON.stringify({
                                display_text: '👨‍💻 𝙂𝙞𝙩𝙝𝙪𝙗 𝙋𝙧𝙤𝙛𝙞𝙡𝙚',
                                url: 'https://github.com/Mrandbad'
                            })
                        },
                        {
                            name: 'cta_url',
                            buttonParamsJson: JSON.stringify({
                                display_text: '📢 𝙑𝙞𝙚𝙬 𝘾𝙝𝙖𝙣𝙣𝙚𝙡',
                                url: 'https://whatsapp.com/channel/0029VbC9TRPCnA80RfS3Oi1V'
                            })
                        },
                        // Row 3
                        {
                            name: 'cta_url',
                            buttonParamsJson: JSON.stringify({
                                display_text: '👥 𝙅𝙤𝙞𝙣 𝙂𝙧𝙤𝙪𝙥',
                                url: 'https://chat.whatsapp.com/DU79JfdnOI83ZFVAyD74Mo?mode=gi_t'
                            })
                        },
                        {
                            name: 'cta_copy',
                            buttonParamsJson: JSON.stringify({
                                display_text: '📋 𝘾𝙤𝙥𝙮 𝙍𝙚𝙥𝙤',
                                url: 'https://github.com/Mrandbad/ANDBAD-MD-V2'
                            })
                        },
                    ]
                }
            },
            { quoted: m }
        );

    } catch (error) {
        console.error('Error in repo command:', error);
        await client.sendMessage(
            m.chat,
            {
                text: `Couldn't fetch repository info.\nVisit directly:\nhttps://github.com/Fred1e/Fee-xmd`
            },
            { quoted: m }
        );
    }
};
