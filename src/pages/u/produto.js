import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Update(){

  const [data2, setData2] = useState([]);
 
  useEffect(() => {
    fetch('/api/categorias/0', { method: 'GET'})
      .then((res) => res.json())
      .then((data2) => {
        setData2(data2);
      });
  }, []);
 
  var Categorias = data2.TBCategoria;


  const router = useRouter();
  const data = router.query;
  
  const idP = data.IDProduto;

  function atualizar(e){
    e.preventDefault();
    const select = document.getElementById("Categoria").value;
    const Nome = document.getElementById("NomeProduto").value;
    const Desc = document.getElementById("DescricaoProduto").value;
    const Medida = document.getElementById("Medida").value;
    const Marca = document.getElementById("MarcaProduto").value;

    const obj = {NomeProduto: Nome, DescricaoProduto: Desc, Medida: Medida, MarcaProduto: Marca, Categoria: select};
    const formJson = JSON.stringify(obj);
    fetch(`/api/produtos/${idP}`, { headers: { 'Content-Type': 'application/json' }, method: 'PUT', body: formJson })
    .then((response) => {
      if(response.ok){
        alert('Produto atualizado')
        window.location.href="../u/produtos";
      }
      else{
        alert('Falha ao atualizar o produto :/')
      }
    });
  }

  return<>
    <div id='cabecalho'>
      <Link href={{pathname: '../crd/produtos'}}>⬅</Link>
      <h1>Atualizar produto {data.NomeProduto}</h1>
    </div>
    <form method="post" onSubmit={atualizar} id="atualizar">
      <div>
      <label for="NomeProduto">Nome: </label>
      <input type="text" name="NomeProduto" id="NomeProduto" placeholder={data.NomeProduto} required/>
      </div>
      <div>
      <label for="DescricaoProduto">Descricao: </label>
      <input type="text" name="DescricaoProduto" id="DescricaoProduto" placeholder={data.DescricaoProduto} required/>
      </div>
      <div>
      <label for="Medida">Medida: </label>
      <input type="text" name="Medida" id="Medida" placeholder={data.Medida}/>
      </div>
      <div>
      <label for="MarcaProduto">Marca: </label>
      <input type="text" name="MarcaProduto" id="MarcaProduto" placeholder={data.MarcaProduto} required/>
      </div>
      <div>
        <label for="Categoria">Categoria: </label>
        <select id="Categoria" required>
          <option value={""}>Selecionar</option>
          {Categorias?.map(categoria =>
            <option key={categoria.IDCategoria} value={categoria.IDCategoria}>{categoria.NomeCategoria}</option>  
          )}
        </select>
      </div>
      <button type='submit'>Atualizar produto</button>
    </form>  

  </>
}