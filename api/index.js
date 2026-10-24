require('dotenv').config();
const app = require('../server/app');

// Export Express app as the Vercel serverless function handler
module.exports = app;
