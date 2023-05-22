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
        const TBMercado = await prisma.TBMercado.findMany()
        res.status(200).json({ TBMercado })
      }
      else if(idP > 0){
        const mercado = await prisma.TBMercado.findUnique({
          where: {
            IDMercado: idP,
          },
        })
        res.status(200).json({ mercado });
      }
    }


    //criar registro
    if(req.method === 'POST' && idP == 0){
        const Nome = req.body.NomeMercado;   
        const Cod = parseInt(req.body.CodCidade);
        const TBMercado = await prisma.TBMercado.create({
            data: {
                NomeMercado: Nome,
                CodCidade: Cod,
            },
          })
        res.status(200).json({ TBMercado })
    }

  //atuaizar registro
  if(req.method === 'PUT'){
    
    //pegando os dados atuais, por precaução:
    const mercado = await prisma.TBMercado.findUnique({
        where: {
          IDMercado: idP,
        },
      })
    //caso o usuário não insira valores no formulário,
    //a API deve deixar os valores atuais do produto.

    let Nome = req.body.NomeMercado;
    if(isNullOrEmpty(Nome)){
      Nome = mercado.NomeProduto
    }

    let Cod = parseInt(req.body.CodCidade);
    if(isNullOrEmpty(Cod)){
      Cod = mercado.CodCidade;
    }

    const updateMercado = await prisma.TBMercado.update({
        where: {
            IDMercado: idP,
        },
        data: {
            NomeMercado: Nome,
            CodCidade: Cod,
        },
    })
    res.status(200).json({ data: updateMercado })
}

    //apagar registro 
    if(req.method === 'DELETE' && idP > 0){
        const deleteMercado = await prisma.TBMercado.delete({
            where: {
            IDMercado: idP,
            },
        })
        res.status(200).json({ data: deleteMercado.IDMercado })
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