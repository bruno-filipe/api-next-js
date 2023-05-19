import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

//função que verifica se o valor é válido
//para ser inserido no banco de dados
function isNullOrEmpty(valor){
  if(valor === null || valor == ""){ return true; }
  else{ return false; }
}

export default async function handler(req, res) {
  //pegando id da URL, passando p/ int p/ ser usado em qualquer função do CRUD 
  const r = req.query;
  const idP = parseInt(r.id);

  //ler registros
  if(req.method === 'GET'){
    if(idP == 0){
      const TBPrecos = await prisma.TBPrecos.findMany()
      res.status(200).json({ TBPrecos })
    }
    else if(idP > 0){
      const HistoricoPrecos = await prisma.TBPrecos.findMany({
          where: {
            CodProduto: idP
          },
      })
      res.status(200).json({HistoricoPrecos })
    }
  }


  //criar registro
  if(req.method === 'POST' && idP == 0){
    let Preco = req.body.PrecoProduto;
    if(Preco.includes(",")){ Preco = Preco.replace(",", "."); }
    Preco = parseFloat(Preco);
    const CodP = parseInt(req.body.CodProduto);
    const DataP = req.body.Data;
    const CodM = parseInt(req.body.CodMercado);
    const TBPrecos = await prisma.TBPrecos.create({
      data: {
        PrecoProduto: Preco,
        CodProduto: CodP,
        Data: DataP,
        CodMercado: CodM,
      },
    })
    res.status(200).json({ TBPrecos })
  }



  //atuaizar registro
  if(req.method === 'PUT'){
    
    //pegando os dados atuais, por precaução:
    const preco = await prisma.TBPrecos.findUnique({
      where: {
        IDPrecos: idP,
      },
    })
    //caso o usuário não insira valores no formulário,
    //a API deve deixar os valores atuais do produto.

    let Preco = req.body.PrecoProduto;
    if(isNullOrEmpty(Preco)){
      Preco = preco.PrecoProduto
    }
    else{
      if(Preco.includes(",")){ Preco = Preco.replace(",", "."); }
      Preco = parseFloat(Preco);
    }
    
    let CodP = parseInt(req.body.CodProduto);
    
    let DataP = req.body.Data;
    if(isNullOrEmpty(DataP)){
      DataP = preco.Data
    }
    let CodM = parseInt(req.body.CodMercado);
    if(isNullOrEmpty(CodM)){
      CodM = preco.CodMercado
    }
      
    const updatePreco = await prisma.TBPrecos.update({
      where: {
          IDPrecos: idP,
      },
      data: {
        PrecoProduto: Preco,
        CodProduto: CodP,
        Data: DataP,
        CodMercado: CodM,
      },
    })
    res.status(200).json({ updatePreco })
  }


  //apagar registro 
  if(req.method === 'DELETE' && idP > 0){
    const deletePreco = await prisma.TBPrecos.delete({
      where: {
        IDPrecos: idP,
      },
    })
    res.status(200).json({ data: deletePreco.IDPreco })
  }
}