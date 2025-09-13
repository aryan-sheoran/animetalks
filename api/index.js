// filepath: /home/luffy/anime-talks/anitalks-project/api/index.js
const app = require('./src/app');  // Import your existing Express app

// Export for Vercel (serverless)
module.exports = app;

// Optional: If you need to handle Vercel's serverless specifics, add middleware here
// For example, 