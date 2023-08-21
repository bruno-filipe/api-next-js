// Importe o pacote 'cors'
const cors = require('cors');

// Configure as opções do cors conforme necessário
const corsOptions = {
  origin: '*', // Permitir todas as origens (não recomendado para produção)
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Métodos permitidos
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

// Configure o middleware de tratamento de requisições pre-flight
module.exports = cors(corsOptions);



async function verificarTokens(id, token) {
  let f;
  await fetch('http://api-next-js-bruno-filipe.vercel.app/api/usuarios/' + id, {
    method: 'GET',
    headers: { 'id': 'vt', 'tk': '7cea26600c288a7055229a1d7e9ba49b' }
  })
    .then(response => response.json())
    .then(data => {
      if (data.Usuario.apiKey.trim() === token.trim()) {
        f = true;
      } else {
        f = false;
      }
    })
    .catch(error => {
      console.error('Erro na requisição:', error);
    });
  return f;
}

const Allow = (handler) => async (req, res) => {
  const token = req.headers['tk'];
  console.log(token)
  const id = req.headers['id'];
  console.log(id)

    if (id === 'vt') {
      if (token === '7cea26600c288a7055229a1d7e9ba49b') {
        console.log("acesso liberado")
        return handler(req, res);
      } else {
        console.log("invalid token")
        return;
      }
    } else {
      if (req.method === 'OPTIONS') {
        console.log('options');
        console.log(res.header);
        res.status(200).end();
        return;
      }
      else{
          const d = await verificarTokens(id, token);
          if (d === true) {
            console.log("acesso liberado")
            return handler(req, res);
          } else {
            console.log("invalid id + token")
            return;
          } 
      }
    }       
}

export default Allow;