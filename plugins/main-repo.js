const fetch = require('node-fetch');
const config = require('../config');
const { cmd } = require('../command');

// Constants for better maintainability
const GITHUB_REPO_URL = 'https://github.com/Mrandbad/ANDBAD-MD-V2';
const DEFAULT_IMAGE_URL = 'https://files.catbox.moe/ksu8c3.jpg';
const AUDIO_URL = 'https://files.catbox.moe/9sb6x4.mp3';
const NEWSLETTER_INFO = {
  newsletterJid: '120363315949714553@newsletter',
  newsletterName: '𝚫𝚴𝐃𝚩𝚫𝐃 𝚫𝚰',
  serverMessageId: 143
};

/*
 * Extracts username and repository name from GitHub URL
 * @param {string} url - GitHub repository URL
 * @returns {Object} Object containing username and repo
 * @throws {Error} If URL is invalid
 */
const extractRepoInfo = (url) => {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match || match.length < 3) {
    throw new Error('Invalid GitHub repository URL');
  }
  
  return {
    username: match[1],
    repoName: match[2]
  };
};

/*
 * Fetches repository data from GitHub API
 * @param {string} username - GitHub username
 * @param {string} repoName - Repository name
 * @returns {Promise<Object>} Repository data
 * @throws {Error} If API request fails
 */
const fetchRepoData = async (username, repoName) => {
  const apiUrl = `https://api.github.com/repos/${username}/${repoName}`;
  const response = await fetch(apiUrl);
  
  if (!response.ok) {
    throw new Error(`GitHub API request failed with status ${response.status}`);
  }
  
  return response.json();
};

/*
 * Formats repository information into a readable string
 * @param {Object} repoData - GitHub repository data
 * @returns {string} Formatted information string
 */
const formatRepoInfo = (repoData) => {
  return `*BOT NAME:* *${repoData.name}*\n\n` +
         `*OWNER NAME:* *${repoData.owner.login}*\n\n` +
         `*STARS:* *${repoData.stargazers_count}*\n\n` +
         `*FORKS:* *${repoData.forks_count}*\n\n` +
         `*GITHUB LINK:*\n> ${repoData.html_url}\n\n` +
         `*DESCRIPTION:*\n> ${repoData.description || 'No description'}\n\n` +
         `*Don't Forget To Star and Fork Repository*\n\n` +
         `> *© Powered By 𝐀𝐍𝐃𝐑𝐄𝐖-𝐓𝐙🇹🇿*`;
};

/*
 * Creates context info for messages
 * @param {string} senderJid - Sender JID to mention
 * @returns {Object} Context info object
 */
const createContextInfo = (senderJid) => {
  return {
    mentionedJid: [senderJid],
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: NEWSLETTER_INFO
  };
};

cmd({
  pattern: "repo",
  alias: ["sc", "script", "info"],
  desc: "Fetch information about a GitHub repository.",
  react: "📂",
  category: "info",
  filename: __filename,
}, async (conn, mek, m, { from, reply }) => {
  try {
    // Extract repository information
    const { username, repoName } = extractRepoInfo(GITHUB_REPO_URL);
    
    // Fetch repository data
    const repoData = await fetchRepoData(username, repoName);
    
    // Format the information
    const formattedInfo = formatRepoInfo(repoData);
    const contextInfo = createContextInfo(m.sender);
    
    // Send image with repository info
    await conn.sendMessage(from, {
      image: { url: DEFAULT_IMAGE_URL },
      caption: formattedInfo,
      contextInfo
    }, { quoted: mek });
    
    // Send audio file
    await conn.sendMessage(from, {
      audio: { url: AUDIO_URL },
      mimetype: 'audio/mp4',
      ptt: true,
      contextInfo
    }, { quoted: mek });
    
  } catch (error) {
    console.error("Error in repo command:", error);
    
    // More specific error messages
    let errorMessage = "Sorry, something went wrong while fetching the repository information. Please try again later.";
    
    if (error.message.includes('Invalid GitHub repository URL')) {
      errorMessage = "The GitHub repository URL is invalid. Please check the configuration.";
    } else if (error.message.includes('GitHub API request failed')) {
      errorMessage = "Failed to fetch repository information from GitHub. The repository might not exist or you might have reached the API rate limit.";
    }
    
    reply(errorMessage);
  }
});
