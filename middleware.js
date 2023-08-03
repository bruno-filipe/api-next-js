async function verificarTokens(id, token){
    let f;
    await fetch('http://api-next-js-bruno-filipe.vercel.app/api/usuarios/'+id, { method: 'GET', headers: { 'id':'vt', 'tk':'7cea26600c288a7055229a1d7e9ba49b'} } )
        .then(response => response.json())
        .then(data => {
            if(data.Usuario.apiKey.trim() === token.trim()){
                f = true;
            }
            else { f = false; }
        })
        .catch(error => {
        console.error('Erro na requisição:', error);
        });
    return f;
}

const Allow = (handler) => async (req, res) => {
    console.log(req.headers);
    const token = req.headers['tk'];
    console.log(token)
    const id = req.headers['id'];
    console.log(id)
    const origin = req.headers.host;
    console.log(origin)
    //primeira verificação pra ver se é a função verificationToken

//né possível véi
    if(id === 'vt'){
        if(token === '7cea26600c288a7055229a1d7e9ba49b' && origin === 'api-next-js-bruno-filipe.vercel.app'){
            res.setHeader("Access-Control-Allow-Origin", origin);
            res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
            res.setHeader("Access-Control-Max-Age", "86400");
            console.log("acesso liberado")
            return handler(req, res);
        }
        else{
            res.setHeader("Access-Control-Allow-Origin", origin);
            res.setHeader("Access-Control-Allow-Methods");
            res.setHeader("Access-Control-Allow-Headers");
            res.setHeader("Access-Control-Max-Age", "86400");
            console.log("acesso negado 1")
            return;
        }
    }
    else{

    var i = 0;
    const whiteList = ['localhost:3000', 'api-next-js-bruno-filipe.vercel.app', 'api-next-js-five.vercel.app'];
    whiteList.forEach(async function(o) {
        if(origin === o){
            const d = await verificarTokens(id, token);
            if(d === true){
                res.setHeader("Access-Control-Allow-Origin", origin);
                res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
                res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
                res.setHeader("Access-Control-Max-Age", "86400");
                console.log("acesso liberado")
                return handler(req, res);
            }
            else{
                res.setHeader("Access-Control-Allow-Origin", origin);
                res.setHeader("Access-Control-Allow-Methods");
                res.setHeader("Access-Control-Allow-Headers");
                res.setHeader("Access-Control-Max-Age", "86400");
                console.log("acesso negado 1")
                return;
            }
        }
        else{
            i++;
        }

        if(i == 3){
            console.log("acesso negado 2");
        }
        if(req.method === 'OPTIONS'){
            res.status(200).end();
            return;
        }
    });
            
    }
}

export default Allow;