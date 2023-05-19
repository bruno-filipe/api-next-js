import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Produtos(){
  const [data, setData] = useState([]);
 
  useEffect(() => {
    fetch('/api/precos/0', { method: 'GET'})
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      });
  }, []);
 
  var Precos = data.TBPrecos;

  const router = useRouter();
  const did = router.query;
  const idP = did.IDProduto;

  const [data2, setData2] = useState([]);
 
  useEffect(() => {
    fetch('/api/mercados/0', { method: 'GET'})
      .then((res) => res.json())
      .then((data2) => {
        setData2(data2);
      });
  }, []);
 
  var Mercados = data2.TBMercado;

  function criar(e){
    const Preco = document.getElementById("PrecoProduto").value;
    const Data = document.getElementById("Data").value;
    const Mercado = document.getElementById("CodMercado").value;
    
    const form = e.target;
    const obj = {CodProduto: idP, PrecoProduto: Preco, Data: Data, CodMercado: Mercado};
    const formJson = JSON.stringify(obj);
    fetch('/api/precos/0', { headers: {'Content-Type': 'application/json'}, method: form.method, body: formJson })
    .then((response) => {
      if(response.ok){
        alert('Preco adicionado')
      }
      else{
        e.preventDefault();
        alert('Falha ao adicionar o novo preco :/');
      }
    });
  }

  const apagar = async idP =>{
    if (confirm("Deseja apagar o preco "+idP+" ?") == true) {
      const response = await fetch(`/api/precos/${idP}`, { method: 'DELETE' });
      const data = await response.json();
      alert(`Preco com ID: ${idP} excluído com sucesso!`);
      location.reload();
    }
  }

  return <>
    <div id='ccrd'>
      <Link href={{pathname: '../crd/precos'}}>⬅</Link>
      <h1>Lista de precos</h1>
    </div>
    <div>
        <ul>{
          Mercados?.map(mercado =>
              <li key={mercado.IDMercado} className='item'>
                <div className='nMercado'>
                  <h2>
                    <b>{mercado.NomeMercado}</b>
                  </h2>
                </div>
                <div className='linha'>
                  {Precos?.filter(pr => pr.CodMercado === mercado.IDMercado)?.map(preco =>
                    <div className='preco' key={preco.IDPrecos}>
                      <div className='pTexto'>
                        <p>R$ {preco.PrecoProduto}<br/>{preco.Data}</p>
                      </div>
                      <div className='pUD'>
                        <button onClick={() => {apagar(preco.IDPrecos)}}>Apagar</button>
                        <Link id="atl" href={{pathname: '/u/preco', query: preco}}><p>Atualizar</p></Link>
                      </div>
                    </div>
                  )}
                </div>
              </li>
          )}
        </ul>
    </div>
    <form method="post" onSubmit={criar} id="enviar">
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
      <button type='submit'>Adicionar preco</button>
    </form>  
    </>;
}