const axios = require("axios");
const fetch = require("node-fetch");

module.exports = {
    name: 'tempmail',
    aliases: ['tempemail', 'tempinbox', 'tempmailcreate'],
    description: 'Create temporary email for disposable inbox',
    run: async (context) => {
        const { client, m, prefix } = context;

        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });

        try {
            const response = await axios.get('https://api.nekolabs.web.id/tools/tempmail/v3/create', {
                timeout: 30000
            });

            if (!response.data.success || !response.data.result) {
                throw new Error('Failed to create temporary email');
            }

            const { email, sessionId, expiresAt } = response.data.result;
            const expires = new Date(expiresAt).toLocaleString();

            await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

            await client.sendMessage(
                m.chat,
                {
                    interactiveMessage: {
                        header: `✅ TEMPORARY EMAIL CREATED!\n\n📧 YOUR EMAIL:\n${email}\n\n🔑 SESSION ID:\n${sessionId}\n\n⏰ EXPIRES: ${expires}\n\n📋 HOW TO CHECK INBOX:\n${prefix}tempinbox ${sessionId}`,
                        footer: "> Powered by Andbadtz",
                        buttons: [
                            {
                                name: "cta_copy",
                                buttonParamsJson: JSON.stringify({
                                    display_text: "📋 Copy Session ID",
                                    id: "copy_session",
                                    copy_code: sessionId
                                })
                            },
                            {
                                name: "cta_copy", 
                                buttonParamsJson: JSON.stringify({
                                    display_text: "📧 Copy Email",
                                    id: "copy_email",
                                    copy_code: email
                                })
                            }
                        ]
                    }
                },
                { quoted: m }
            );

        } catch (error) {
            console.error('TempMail error:', error);
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });

            let errorMessage = `Failed to create temporary email, you impatient creature. `;
            if (error.message.includes('timeout')) {
                errorMessage += "API took too long, try again later. 🙄";
            } else if (error.message.includes('Network Error')) {
                errorMessage += "Check your internet connection, dummy. 📶";
            } else if (error.message.includes('Failed to create')) {
                errorMessage += "Email service is down, try later. 🤷🏻";
            } else {
                errorMessage += `Error: ${error.message}`;
            }

            await client.sendMessage(m.chat, {
                text: `❥┈┈┈┈┈┈┈┈┈┈┈┈┈┈➤\n┋✿ ${errorMessage}\n❥┈┈┈┈┈┈┈┈┈┈┈┈┈┈➤\n> Powered by Andbadtz`
            }, { quoted: m });
        }
    },
};