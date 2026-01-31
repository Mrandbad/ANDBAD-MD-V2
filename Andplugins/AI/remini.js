const fetch = require('node-fetch');
const FormData = require('form-data');

const formatStylishReply = (message) => {
    return `❥┈┈┈┈┈┈┈┈┈┈┈┈┈┈➤\n┋❥✿ ${message}\n❥┈┈┈┈┈┈┈┈┈┈┈┈┈┈➤`;
};

async function uploadToCatbox(buffer) {
    const form = new FormData();
    form.append('reqtype', 'fileupload');
    form.append('fileToUpload', buffer, { filename: 'image.png' });

    const response = await fetch('https://catbox.moe/user/api.php', {
        method: 'POST',
        body: form,
        headers: form.getHeaders(),
    });

    const text = await response.text();
    if (!text.includes('catbox')) {
        throw new Error('upload failed');
    }

    return text.trim();
}

module.exports = async (context) => {
    const { client, m, text } = context;

    if (!text && !m.quoted && !(m.mtype === 'imageMessage' && m.body.includes('.remini'))) {
        return m.reply(formatStylishReply("give me an image you dumbass 🤦🏻\nexample: .remini https://image.com/trash.png or reply to image"));
    }

    let imageUrl = text;

    if ((!text || text === '.remini') && m.quoted && m.quoted.mtype === 'imageMessage') {
        try {
            const buffer = await client.downloadMediaMessage(m.quoted);
            imageUrl = await uploadToCatbox(buffer);
        } catch (uploadError) {
            console.error(`upload failed: ${uploadError.message}`);
            return m.reply(formatStylishReply("can't upload your shitty image 🤦🏻 try again"));
        }
    }

    if (m.mtype === 'imageMessage' && m.body.includes('.remini')) {
        try {
            const buffer = await client.downloadMediaMessage(m);
            imageUrl = await uploadToCatbox(buffer);
        } catch (uploadError) {
            console.error(`upload failed: ${uploadError.message}`);
            return m.reply(formatStylishReply("can't upload your shitty image 🤦🏻 try again"));
        }
    }

    if (!imageUrl || imageUrl === '.remini') {
        return m.reply(formatStylishReply("no valid image you clueless twat 🤡"));
    }

    try {
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });

        const encodedUrl = encodeURIComponent(imageUrl);
        const apiUrl = `https://api.nekolabs.web.id/tools/upscale/ihancer?imageUrl=${encodedUrl}&size=medium`;

        const response = await fetch(apiUrl);
        const result = await response.json();

        if (!result.success || !result.result) {
            throw new Error('api returned error');
        }

        const imageResponse = await fetch(result.result);
        const imageBuffer = await imageResponse.buffer();

        if (!imageBuffer || imageBuffer.length < 1000) {
            throw new Error('api didnt return an image 🤦🏻');
        }

        await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

        await client.sendMessage(
            m.chat,
            {
                image: imageBuffer,
                caption: `❥┈┈┈┈┈┈┈┈┈┈┈┈┈┈➤\n┋❥✿ enhanced image ✅\n┋❥✿ ANDBAD-BOT\n❥┈┈┈┈┈┈┈┈┈┈┈┈┈┈➤`
            },
            { quoted: m }
        );

    } catch (error) {
        console.error(`error in remini: ${error.message}`);
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        await m.reply(formatStylishReply(`shit broke 🤦🏻 error: ${error.message}`));
    }
};