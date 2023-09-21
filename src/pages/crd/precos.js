import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Produtos(){
  const [data, setData] = useState([]);
 
  useEffect(() => {
    fetch('/api/produtos/0', { method: 'GET', headers: {'id':'1', 'tk':'7cea26600c288a7055229a1d7e9ba49b'}})
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      });
  }, []);
 
  var Produtos = data.TBProduto;

  return <>
    <div id='ccrd'>
      <Link href={{pathname: '../'}}>⬅</Link>
      <h1>Lista de produtos</h1>
    </div>
    <div>
        <ul>{
          Produtos?.map(produto =>
              <li key={produto.IDProduto}>
                <img className='imagem' src={produto.FotoProduto} alt='Foto do Produto'></img>
                <div className='texto'>
                  <h2>
                    <b>{produto.NomeProduto}</b>{' ' + produto.MarcaProduto}
                  </h2>
                  <p>{produto.DescricaoProduto} {produto.Medida}</p>
                </div>
                <div className='ud'>
                  <Link id="atl" href={{pathname: '/crd/spreco', query: {IDProduto: produto.IDProduto}}}><p>Precos</p></Link>
                </div>
              </li>
          )}
        </ul>
    </div>
    </>;
}