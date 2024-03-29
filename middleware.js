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
//  console.log(token)
  const id = req.headers['id'];
//  console.log(id)

    if (req.method === 'OPTIONS') {
      console.log('options');
      res.status(200).end();
      return;
    }

    if (id === 'vt') {
      if (token === '7cea26600c288a7055229a1d7e9ba49b') {
//        console.log("acesso liberado")
        return handler(req, res);
      } else {
//        console.log("credenciais inválidas")
        return;
      }
    } else {
      if (req.method === 'OPTIONS') {
//        console.log('options');
        res.status(200).end();
        return;
      }
      else{
          const d = await verificarTokens(id, token);
          if (d === true) {
//            console.log("acesso liberado");
            return handler(req, res);
          }
      }
    }       
}

export default Allow;