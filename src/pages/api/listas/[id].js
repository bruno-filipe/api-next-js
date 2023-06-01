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
            const TBLista = await prisma.TBLista.findMany()
            res.status(200).json({ TBLista })
        }
        else if(idP > 0){
            const Lista = await prisma.TBLista.findUnique({
                where: {
                    IDLista: idP,
                },
            })
            res.status(200).json({ Lista });
        }
    }

    //alterando registro
    if(req.method === 'PUT'){
    
        //pegando os dados atuais, por precaução:
        const Lista = await prisma.TBLista.findUnique({
            where: {
                IDLista: idP,
            },
        })
        //caso o usuário não insira valores no formulário,
        //a API deve deixar os valores atuais do produto.

        let Nome = req.body.Nome;
        if(isNullOrEmpty(Nome)){
          Nome = Lista.Nome
        }

        const updateLista = await prisma.TBLista.update({
            where: {
                IDLista: idP,
            },
            data: {
                Nome: Nome,
            },
        })
        res.status(200).json({ updateLista })
    }
    


    //criar registro
    if(req.method === 'POST' && idP == 0){
        const Nome = req.body.Nome;
        const Cod = req.body.Cod;
        const TBLista = await prisma.TBLista.create({
            data: {
                Nome: Nome,
                CodUsuario: Cod,
            },
        })
        res.status(200).json({ TBLista })
    }

    //apagar registro 
    if(req.method === 'DELETE' && idP != 0){
        const deleteProduto = await prisma.TBLista.delete({
            where: {
              IDLista: idP,
            },
        })
        res.status(200).json({ data: deleteProduto.IDLista })
    }
}

export default Allow(handler);