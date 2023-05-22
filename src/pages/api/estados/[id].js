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
  const idP = r.id;

    //ler registros
    if(req.method === 'GET'){
        if(idP == 0){
            const TBEstado = await prisma.TBEstado.findMany()
            res.status(200).json({ TBEstado })
        }
        else if(idP > 0){
            const Estado = await prisma.TBEstado.findUnique({
                where: {
                IDUF: idP,
                },
            })
            res.status(200).json({ Estado });
        }
    }

    //alterando registro
    if(req.method === 'PUT'){
    
        //pegando os dados atuais, por precaução:
        const Estado = await prisma.TBEstado.findUnique({
            where: {
            IDUF: idP,
            },
        })
        res.status(200).json({ Estado });
        //caso o usuário não insira valores no formulário,
        //a API deve deixar os valores atuais do produto.

        let ID = req.body.IDUF;
        if(isNullOrEmpty(ID)){
          ID = Estado.IDUF;
        }
    
        let Nome = req.body.NomeEstado;
        if(isNullOrEmpty(Nome)){
          Nome = Estado.NomeEstado
        }

        const updateEstado = await prisma.TBEstado.update({
            where: {
                IDUF: idP,
            },
            data: {
                IDUF: ID,
                NomeEstado: Nome,
            },
        })
        res.status(200).json({ data: updateEstado })
    }
    


    //criar registro
    if(req.method === 'POST' && idP == 0){
        const ID = req.body.IDUF;    
        const Nome = req.body.NomeEstado;
        const TBEstado = await prisma.TBEstado.create({
            data: {
                IDUF: ID,
                NomeEstado: Nome,
            },
        })
        res.status(200).json({ TBEstado })
    }

    //apagar registro 
    if(req.method === 'DELETE' && idP != 0){
        const deleteEstado = await prisma.TBEstado.delete({
            where: {
              IDUF: idP,
            },
        })
        res.status(200).json({ data: deleteEstado.IDUF })
    }
}

export default Allow(handler);