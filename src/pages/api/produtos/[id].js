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
      const TBProduto = await prisma.TBProduto.findMany()
      res.status(200).json({ TBProduto });
    }
    else if(idP > 0){
      const produto = await prisma.TBProduto.findUnique({
        where: {
          IDProduto: idP,
        },
      })
      res.status(200).json({ produto })
    }
  }



  //criar registro
  if(req.method === 'POST' && idP == 0){
    const Nome = req.body.NomeProduto;    
    const Desc = req.body.DescricaoProduto;
    const Med = req.body.Medida;
    const Marca = req.body.MarcaProduto;
    const cat = parseInt(req.body.Categoria);
    const TBProduto = await prisma.TBProduto.create({
      data: {
        NomeProduto: Nome,
        DescricaoProduto: Desc,
        Medida: Med,
        FotoProduto: "",
        MarcaProduto: Marca,
        CodCategoria: cat,
      },
    })
    res.status(200).json({ TBProduto })
  }


  //atuaizar registro
  if(req.method === 'PUT'){
    
    //pegando os dados atuais, por precaução:
    const produto = await prisma.TBProduto.findUnique({
      where: {
        IDProduto: idP,
      },
    })
    //caso o usuário não insira valores no formulário,
    //a API deve deixar os valores atuais do produto.

    let Nome = req.body.NomeProduto;
    if(isNullOrEmpty(Nome)){
      Nome = produto.NomeProduto
    }

    let Desc = req.body.DescricaoProduto;
    if(isNullOrEmpty(Desc)){
      Desc = produto.DescricaoProduto;
    }
  
    let Med = req.body.Medida;
    if(isNullOrEmpty(Med)){
      Med = produto.Medida;
    }

    let Marca = req.body.MarcaProduto;
    if(isNullOrEmpty(Marca)){
      Marca = produto.marcaProduto;
    }

    let cat = parseInt(req.body.Categoria);
    if(isNullOrEmpty(cat)){
      cat = produto.CodCategoria;
    }

    const updateProduto = await prisma.TBProduto.update({
      where: {
          IDProduto: idP,
      },
      data: {
        NomeProduto: Nome,
        DescricaoProduto: Desc,
        Medida: Med,
        FotoProduto: "",
        MarcaProduto: Marca,
        CodCategoria: cat,
      },
  })
  res.status(200).json({ data: updateProduto })
  }


  //apagar registro 
  if(req.method === 'DELETE' && idP > 0){
    const deleteProduto = await prisma.TBProduto.delete({
        where: {
          IDProduto: idP,
        },
    })
    res.status(200).json({ data: deleteProduto.IDProduto })
  }
  /*if(req.method === 'DELETE' && idP == 0){
    const deleteProdutos = await prisma.TBProduto.deleteMany({})
    res.status(200).json("Every records were deleted")
  }*/
}

export default Allow(handler);