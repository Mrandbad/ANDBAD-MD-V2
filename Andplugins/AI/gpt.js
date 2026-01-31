const fetch = require('node-fetch');

module.exports = async (context) => {
    const { client, m, text, botname } = context;

    if (!botname) return m.reply("The bot has no name. The developer is clearly as competent as you are.");
    if (!text) return m.reply("Where is your prompt? You managed to type the command but forgot the question. Amazing.");
    
    try {
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });

        const apiUrl = `https://ab-chatgpt4o.abrahamdw882.workers.dev/?q=${encodeURIComponent(text)}`;
        const response = await fetch(apiUrl, { timeout: 10000 });
        
        if (!response.ok) throw new Error(`Service unavailable: ${response.status}`);
        
        const data = await response.json();
        if (!data.status || !data.data) throw new Error('The AI returned a blank, useless response.');

        let replyText = data.data;

        await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
        await m.reply(`[GPT]\n${replyText}\n—\nANDBAD-MD`);
        
    } catch (error) {
        console.error(`GPT error:`, error);
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        let userMessage = 'The AI service has failed. Surprise.';
        if (error.message.includes('Service unavailable')) userMessage = 'The API is down. Blame their infrastructure, not my competence.';
        if (error.message.includes('blank, useless')) userMessage = 'The AI returned empty text. Try asking a question that makes sense.';
        await m.reply(`${userMessage}\nError: ${error.message}`);
    }
};