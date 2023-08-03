import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Produtos(){
  //pega produtos pra exibit na lista
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  
  useEffect(() => {
    setLoading(true);
    fetch('/api/produtos/0', { headers: {'id':'4', 'tk':'7cea26600c288a7055229a1d7e9ba49b'}, method: 'GET'})
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, []);
 
  var Produtos = data.TBProduto;

  //pega categorias para o select do form lá embaixo
  const [data2, setData2] = useState([]);
 
  useEffect(() => {
    fetch('/api/categorias/0', { headers: {'id':'4', 'tk':'7cea26600c288a7055229a1d7e9ba49b'}, method: 'GET'})
      .then((res) => res.json())
      .then((data2) => {
        setData2(data2);
      });
  }, []);
 
  var Categorias = data2.TBCategoria;

  function criar(e){
    e.preventDefault();
    const select = document.getElementById("Categoria").value;
    const Nome = document.getElementById("NomeProduto").value;
    const Desc = document.getElementById("DescricaoProduto").value;
    const Medida = document.getElementById("Medida").value;
    const Marca = document.getElementById("MarcaProduto").value;

    const form = e.target;
    const obj = {NomeProduto: Nome, DescricaoProduto: Desc, Medida: Medida, MarcaProduto: Marca, Categoria: select};
    const formJson = JSON.stringify(obj);
    fetch('/api/produtos/0', { headers: {'Content-Type': 'application/json', 'id':'4', 'tk':'7cea26600c288a7055229a1d7e9ba49b'}, method: form.method, body: formJson })
    .then((response) => {
      if(response.ok){
        alert('Produto adicionado');
        location.reload();
      }
      else{
        alert('Falha ao adicionar o novo produto :/');
      }
    });
  }

  const apagar = async idP =>{
    if (confirm("Deseja apagar o produto "+idP+" ?") == true) {
      const response = await fetch(`/api/produtos/${idP}`, { headers: {'id':'4', 'tk':'7cea26600c288a7055229a1d7e9ba49b'}, method: 'DELETE'});
      const data = await response.json();
      alert(`Produto com ID: ${data.data} excluído com sucesso!`);
      location.reload();
    }
  }

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
                  <button onClick={() => {apagar(produto.IDProduto)}}>Apagar</button>
                  
                  <Link id="atl" href={{pathname: '/u/produto', query: produto}}><p>Atualizar</p></Link>
                </div>
              </li>
          )}
        </ul>
    </div>
    <form method="post" onSubmit={criar} id="enviar">
      <div>
      <label for="NomeProduto">Nome: </label>
      <input type="text" name="NomeProduto" id="NomeProduto" placeholder='Molho de tomate' required/>
      </div>
      <div>
      <label for="DescricaoProduto">Descricao: </label>
      <input type="text" name="DescricaoProduto" id="DescricaoProduto" placeholder="sache" required/>
      </div>
      <div>
      <label for="Medida">Medida: </label>
      <input type="text" name="Medida" id="Medida" placeholder="300 gr" required/>
      </div>
      <div>
      <label for="MarcaProduto">Marca: </label>
      <input type="text" name="MarcaProduto" id="MarcaProduto" placeholder="Stela D'Oro" required/>
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
      <button type='submit'>Adicionar produto</button>
    </form>  
    </>;
}