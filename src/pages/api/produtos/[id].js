import { json } from 'express';
import Allow from '../../../../middleware';
import { PrismaClient } from '@prisma/client';
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
    const web = "------WebKitFormBoundary";
    const edit = req.body;
    const keys = ["NomeProduto", "DescricaoProduto", "Medida", "MarcaProduto", "FotoProduto", "Categoria"];
    let values = [];
    let l = 0;
    
    for(let i = 0; i < keys.length ; i++){
      let m = edit.indexOf(keys[i], l);
      m += keys[i].length + 1;
      l = req.body.indexOf(web, m);
      values[i] = edit.substring(m, l).trim();
    }
    const validBase64 = values[4].replace(/[^a-zA-Z0-9+/=]/g, "");
    const decodedBase64 = atob(validBase64);
    const data = new Uint8Array(decodedBase64.length);
    for (let i = 0; i < decodedBase64.length; i++) {
      data[i] = decodedBase64.charCodeAt(i);
    }


    const TBProduto = await prisma.TBProduto.create({
      data: {
        NomeProduto: values[0],
        DescricaoProduto: values[1],
        Medida: values[2],
        MarcaProduto: values[3],
        FotoProduto: Buffer.from(data),
        CodCategoria: parseInt(values[5]),
      },
    })
    res.status(200).json({ data: TBProduto.NomeProduto })
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

    const Foto = req.body.FotoProduto;

    const updateProduto = await prisma.TBProduto.update({
      where: {
          IDProduto: idP,
      },
      data: {
        NomeProduto: Nome,
        DescricaoProduto: Desc,
        Medida: Med,
        FotoProduto: Foto,
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