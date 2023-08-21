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
  const origin = req.headers['Origin'];
  console.log(origin)

    if (id === 'vt') {
      if (token === '7cea26600c288a7055229a1d7e9ba49b' && origin === 'https://api-next-js-bruno-filipe.vercel.app') {
        res.setHeader("Access-Control-Allow-Origin", origin);
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, tk, id");
        res.setHeader("Access-Control-Max-Age", "86400");
        console.log("acesso liberado")
        return handler(req, res);
      } else {
        res.setHeader("Access-Control-Allow-Origin", origin);
        res.setHeader("Access-Control-Allow-Methods");
        res.setHeader("Access-Control-Allow-Headers");
        res.setHeader("Access-Control-Max-Age", "86400");
        console.log("invalid token or origin")
        return;
      }
    } else {
      if (req.method === 'OPTIONS') {
        res.setHeader("Access-Control-Allow-Origin", origin);
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, tk, id");
        res.setHeader("Access-Control-Max-Age", "86400");
        res.status(200).end();
        return;
      }
      else{
        const whiteList = ['http://localhost:3000',
        'https://localhost:3000', 
        'http://localhost:8100',
        'https://localhost:8100', 
        'https://api-next-js-bruno-filipe.vercel.app',
        'https://api-next-js-five.vercel.app',
        'https://api-next-js-git-main-bruno-filipe.vercel.app'];

        const even = (o) => o === origin;

        if(whiteList.some(even)){
          
          console.log("deu certo");

          const d = await verificarTokens(id, token);
          if (d === true) {
            res.setHeader("Access-Control-Allow-Origin", origin);
            res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, tk, id");
            res.setHeader("Access-Control-Max-Age", "86400");
            console.log("acesso liberado")
            return handler(req, res);
          } else {
            res.setHeader("Access-Control-Allow-Origin", origin);
            res.setHeader("Access-Control-Allow-Methods");
            res.setHeader("Access-Control-Allow-Headers");
            res.setHeader("Access-Control-Max-Age", "86400");
            console.log("invalid id + token")
            return;
          } 
        }
        else {
          console.log("invalid origin");
        }
      }
    }       
}

export default Allow;