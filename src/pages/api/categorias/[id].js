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
      const TBCategoria = await prisma.TBCategoria.findMany()
      res.status(200).json( TBCategoria )
    }
    else if(idP > 0){
      const categoria = await prisma.TBCategoria.findUnique({
        where: {
          IDCategoria: idP,
        },
      })
      res.status(200).json( categoria );
    }
  }



  //criar registro
  if(req.method === 'POST' && idP == 0){
    const Nome = req.body.NomeCategoria;
    const TBCategoria = await prisma.TBCategoria.create({
      data: {
        NomeCategoria: Nome,
      },
    })
    res.status(200).json({ TBCategoria })
  }


  //atuaizar registro
  if(req.method === 'PUT'){
    
    //pegando os dados atuais, por precaução:
    const produto = await prisma.TBCategoria.findUnique({
      where: {
        IDCategoria: idP,
      },
    })
    //caso o usuário não insira valores no formulário,
    //a API deve deixar os valores atuais do produto.

    let Nome = req.body.NomeCategoria;
    if(isNullOrEmpty(Nome)){
      Nome = produto.NomeCategoria
    }

    const updateCategoria = await prisma.TBCategoria.update({
      where: {
          IDCategoria: idP,
      },
      data: {
        NomeCategoria: Nome,
      },
  })
  res.status(200).json({ data: updateCategoria })
  }


  //apagar registro 
  if(req.method === 'DELETE' && idP > 0){
    const deleteCategoria = await prisma.TBCategoria.delete({
        where: {
          IDCategoria: idP,
        },
    })
    res.status(200).json({ data: deleteCategoria.IDCategoria })
  }
/*  if(req.method === 'DELETE' && idP == 0){
    const deleteCategorias = await prisma.TBCategoria.deleteMany({})
    res.status(200).json("Every records were deleted")
  }*/
}

export default Allow(handler);