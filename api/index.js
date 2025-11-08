// Importar o app Express existente do backend
const app = require('../backEnd/servidor.js');

// Exportar como serverless function que remove o prefixo /api
module.exports = (req, res) => {
  // Remove /api do início da URL para que o Express processe corretamente
  req.url = req.url.replace(/^\/api/, '') || '/';

  return app(req, res);
};
