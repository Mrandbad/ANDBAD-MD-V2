const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'pair',
    aliases: ['code', 'session', 'qrcode'],
    description: 'Get WhatsApp pairing code',
    run: async (context) => {
        const { client, m, text, prefix } = context;

        if (!text) {
            return client.sendMessage(
                m.chat,
                { text: `⁉️Use Example:\n${prefix}pair 25578230xxxx to get Andbad-md code` },
                { quoted: m }
            );
        }

        try {
            await client.sendMessage(
                m.chat,
                { react: { text: '⌛', key: m.key } }
            );

            // clean number
            const number = text.replace(/[^0-9]/g, '');
            const apiUrl = `https://fee-xmd-pair.onrender.com/code?number=${encodeURIComponent(number)}`;

            const response = await axios.get(apiUrl);
            if (!response.data || !response.data.code) {
                throw new Error('Invalid API response');
            }

            const pairingCode = response.data.code;

            await client.sendMessage(
                m.chat,
                { react: { text: '✅', key: m.key } }
            );

            const imagesDir = path.join(__dirname, '../andbad_tz');
            let imageBuffer;

            if (fs.existsSync(imagesDir)) {
                const images = fs.readdirSync(imagesDir).filter(f =>
                    /^menu\d+\.jpg$/i.test(f)
                );
                if (images.length > 0) {
                    const random = images[Math.floor(Math.random() * images.length)];
                    imageBuffer = fs.readFileSync(path.join(imagesDir, random));
                }
            }

       
            await client.sendMessage(
                m.chat,
                {
                    ...(imageBuffer ? { image: imageBuffer } : {}),
                    interactiveMessage: {
                        header: '🩷 DEVICE WANT TO LOGIN',
                        title: `This is your Code:\n\n${pairingCode}\n\nTap the button below to copy`,
                        footer: '> Powered by 𝗔𝗻𝗱𝗯𝗮𝗱𝗧𝗭✦',
                        buttons: [
                            {
                                name: 'cta_copy',
                                buttonParamsJson: JSON.stringify({
                                    display_text: ' Copy Code',
                                    id: 'copy_pair_code',
                                    copy_code: pairingCode
                                })
                            },
                            {
                                name: 'cta_url',
                                buttonParamsJson: JSON.stringify({
                                    display_text: '🌐 Website',
                                    url: 'https://fee-xmd.online'
                                })
                            },
                            {
                                name: 'cta_url',
                                buttonParamsJson: JSON.stringify({
                                    display_text: '✨ Source Link',
                                    url: 'https://github.com/Mrandbad/ANDBAD-MD-V2'
                                })
                            },
                            {
                                name: 'cta_url',
                                buttonParamsJson: JSON.stringify({
                                    display_text: '🧧 View Channel',
                                    url: 'https://whatsapp.com/channel/0029VbC9TRPCnA80RfS3Oi1V'
                                })
                            }
                        ]
                    }
                },
                { quoted: m }
            );

        } catch (error) {
            console.error('PAIR ERROR:', error);

            await client.sendMessage(
                m.chat,
                { react: { text: '❌', key: m.key } }
            );

            await client.sendMessage(
                m.chat,
                { text: '❌ Failed to generate pairing code. Try again later.' },
                { quoted: m }
            );
        }
    }
};
