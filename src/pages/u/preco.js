import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Update(){
    const [data2, setData2] = useState([]);
 
    useEffect(() => {
      fetch('/api/mercados/0', { method: 'GET'})
        .then((res) => res.json())
        .then((data2) => {
          setData2(data2);
        });
    }, []);
   
    var Mercados = data2.TBMercado;
  
  
  const router = useRouter();
  const data = router.query;
  
  const idP = data.IDPrecos;

  function atualizar(e){
    e.preventDefault();
    const Data = document.getElementById("Data").value;
    const Preco = document.getElementById("PrecoProduto").value;
    const Mercado = document.getElementById("CodMercado").value;
    
    const form = e.target;
    const obj = {PrecoProduto: Preco, CodProduto: data.CodProduto, Data: Data, CodMercado: Mercado};
    const formJson = JSON.stringify(obj);
    fetch('/api/precos/'+idP, { headers: {'Content-Type': 'application/json'}, method: 'PUT', body: formJson })
    .then((response) => {
      if(response.ok){
        alert('Preco atualizado')
        window.location.href="../crd/spreco";
      }
      else{
        alert('Falha ao atualizar o preco :/');
      }
    });
  }
  return<>
    <div id='cabecalho'>
      <Link href={{pathname: '../crd/spreco'}}>⬅</Link>
      <h1>Atualizar preco</h1>
    </div>
    <form method="post" onSubmit={atualizar} id="enviar">
      <div>
      <label for="PrecoProduto">Preço: </label>
      <input type="text" name="PrecoProduto" id="PrecoProduto" placeholder='3.79' required/>
      </div>
      <div>
      <label for="Data">Descricao: </label>
      <input type="text" name="Data" id="Data" placeholder="15/03/2023" required/>
      </div>
      <div>
      <label for="CodMercado">Mercado: </label>
      <select id="CodMercado">
        <option value="">Selecionar</option>
        {Mercados?.map(mercado =>
          <option key={mercado.IDMercado} value={mercado.IDMercado}>{mercado.NomeMercado}</option>  
        )}
      </select>
      </div>
      <button type='submit'>Atualizar preco</button>
    </form>  
  
  </>
}