import middleware from '../../../../middleware';
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();

//função que verifica se o valor é válido
//para ser inserido no banco de dados
function isNullOrEmpty(valor){
    if(valor == null || valor == ""){ return true; }
    else{ return false; }
}

export default async function handler(req, res){
    //pegando id da URL, passando p/ int p/ ser usado em qualquer função do CRUD 
    const r = req.query;
    const idP = parseInt(r.id);

    //ler registros
    if(req.method === 'GET'){
        if(idP == 0){
            const TBCidade = await prisma.TBCidade.findMany()
            res.status(200).json({ TBCidade })
        }
        else if(idP > 0){
            const Cidade = await prisma.TBCidade.findUnique({
                where: {
                IDCidade: idP,
                },
            })
            res.status(200).json({ Cidade });
        }
    }

    //criar registro
    if(req.method === 'POST' && idP == 0){
        const Nome = req.body.NomeCidade;
        const Cod = req.body.CodUF;    
        const TBCidade = await prisma.TBCidade.create({
            data: {
                NomeCidade: Nome,
                CodUF: Cod,
            },
          })
          res.status(200).json({ TBCidade })
    }

    //alterar registro
    if(req.method === 'PUT' && idP > 0){
    
        //pegando os dados atuais, por precaução:
        const Cidade = await prisma.TBCidade.findUnique({
            where: {
            IDCidade: idP,
            },
        })
        //caso o usuário não insira valores no formulário,
        //a API deve deixar os valores atuais do produto.

        let Nome = req.body.NomeCidade;
        if(isNullOrEmpty(Nome)){
          Nome = Cidade.NomeCidade
        }

        let Cod = req.body.CodUF;
        if(isNullOrEmpty(Cod)){
          Cod = Cidade.CodUF;
        }

        const updateCidades = await prisma.TBCidade.update({
            where: {
                IDCidade: idP,
            },
            data: {
                NomeCidade: Nome,
                CodUF: Cod,
            },
        })
        res.status(200).json({ data: updateCidades })
    }

    //apagar registro 
    if(req.method === 'DELETE' && idP != 0){
        const deleteCidade = await prisma.TBCidade.delete({
            where: {
              IDCidade: idP,
            },
        })
        res.status(200).json({ data: deleteCidade.IDCidade })
    }
}

export const config = {
    api: {
      bodyParser: false,
      externalResolver: true,
      // Add middleware to the middleware chain before the route handler
      beforeHandler: [middleware],
    },
  };