import Allow from '../../../../middleware';
import { PrismaClient } from '@prisma/client'
import md5 from 'md5';
const prisma = new PrismaClient();


//função que verifica se o valor é válido
//para ser inserido no banco de dados
function isNullOrEmpty(valor){
  if(valor == null || valor == ""){ return true; }
  else{ return false; }
}

const handler = async (req, res) => {
  //pegando id da URL, passando p/ int p/ ser usado em qualquer função do CRUD 
  const r = req.query;
  const idP = parseInt(r.id);
    //ler registros
    if(req.method === 'GET'){
        if(idP == 0){
            const TBUsuarios = await prisma.TBUsuario.findMany()
            res.status(200).json({ TBUsuarios })
        }
        else if(idP > 0){
            const Usuario = await prisma.TBUsuario.findUnique({
                where: {
                IDUsuario: idP,
                },
            })
            res.status(200).json({ Usuario });
        }
    }

    //alterando registro
    if(req.method === 'PUT'){
    
        //pegando os dados atuais, por precaução:
        const Usuario = await prisma.TBUsuario.findUnique({
            where: {
            IDUsuario: idP,
            },
        })
        //caso o usuário não insira valores no formulário,
        //a API deve deixar os valores atuais do produto.
    
        let Nome = req.body.Nome;
        if(isNullOrEmpty(Nome)){
          Nome = Usuario.Nome;
        }

        let Senha = req.body.Senha;
        if(isNullOrEmpty(Senha)){
          Senha = Usuario.Senha;
        }

        let Email = req.body.Email;
        if(isNullOrEmpty(Email)){
          Email = Usuario.Email;
        }
        const updateUsuario = await prisma.TBUsuario.update({
            where: {
                IDUsuario: idP,
            },
            data: {
                Nome: Nome,
                Senha: md5(Senha),
                Email: Email,
            },
        })
        res.status(200).json( updateUsuario.Nome )
    }
    


    //criar registro
    if(req.method === 'POST' && idP == 0){
        const Nome = req.body.Nome;
        const Email = req.body.Email;
        const Senha = md5(req.body.Senha);
        const result = await prisma.$queryRaw`SELECT LAST_INSERT_ID(IDUsuario) AS id FROM TBUsuario `;
        const lastId = result[0].id.toString();
        let ApiKey = md5(`${parseInt(lastId) + 1}${Date.now()}`);
        const TBUsuarios = await prisma.TBUsuario.create({
            data: {
                Nome: Nome,
                Senha: Senha,
                Email: Email,
                apiKey: ApiKey,
            },
        });
        res.status(200).json( TBUsuarios.Nome );
    }
    //apagar registro 
    if(req.method === 'DELETE' && idP != 0){
        const deleteUsuario = await prisma.TBUsuario.delete({
            where: {
              IDUsuario: idP,
            },
        })
        res.status(200).json( deleteUsuario.IDUsuario )
    }


    prisma.$disconnect()
    .then(() => {
      console.log('Conexão com o banco de dados encerrada.');
    })
    .catch((error) => {
      console.error('Erro ao desconectar do banco de dados:', error);
    });
}
export default Allow(handler);