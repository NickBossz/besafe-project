// API wrapper for Vercel serverless functions
const app = require('../servidor.js');

// Export handler that strips /api prefix
module.exports = (req, res) => {
  // Remove /api prefix from the URL
  req.url = req.url.replace(/^\/api/, '');

  // If URL becomes empty, set it to /
  if (!req.url || req.url === '') {
    req.url = '/';
  }

  return app(req, res);
};
