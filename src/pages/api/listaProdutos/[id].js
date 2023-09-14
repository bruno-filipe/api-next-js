import Allow from '../../../../middleware';
import { PrismaClient } from '@prisma/client'
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
            const TBListaProduto = await prisma.TBListaProduto.findMany()
            res.status(200).json({ TBListaProduto })
        }
        else if(idP > 0){
            const ListaProduto = await prisma.TBListaProduto.findUnique({
                where: {
                    CodLista: idP,
                },
            })
            res.status(200).json({ ListaProduto });
        }
    }

    //criar registro
    if(req.method === 'POST' && idP == 0){
        const CodPt = req.body.CodPt;
        const CodL = req.body.CodL;
        const CodPc = req.body.CodPc;
        const TBListaProduto = await prisma.TBListaProduto.create({
            data: {
                CodLista: CodL,
                CodProduto: CodPt,
                CodPreco: CodPc,
            },
        })
        res.status(200).json({ TBListaProduto })
    }

//atuaizar registro
if(req.method === 'PUT'){
    
    //pegando os dados atuais, por precaução:
    const LP = await prisma.TBListaProduto.findUnique({
        where: {
          CodLista: idP,
        },
      })
    //caso o usuário não insira valores no formulário,
    //a API deve deixar os valores atuais do produto.

    let Qtd = req.body.qtd;
    if(isNullOrEmpty(qtd)){
      Qtd = LP.qtd;
    }

    const updateLP = await prisma.TBListaProduto.update({
        where: {
            CodLista: idP,
        },
        data: {
            qtd: Qtd,
        },
    })
    res.status(200).json({ data: updateLP })
}

    //apagar registro 
    if(req.method === 'DELETE'){
        const deleteProduto = await prisma.TBListaProduto.delete({
            where: {
              CodLista: idP,
            },
        })
        res.status(200).json({ data: deleteProduto.CodLista })
    }
}

export default Allow(handler);