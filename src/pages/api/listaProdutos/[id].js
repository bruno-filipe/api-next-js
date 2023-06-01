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

    //apagar registro 
    if(req.method === 'DELETE' && idP != 0){
        const deleteProduto = await prisma.TBListaProduto.delete({
            where: {
              CodLista: idP,
            },
        })
        res.status(200).json({ data: deleteProduto.CodLista })
    }
}

export default Allow(handler);