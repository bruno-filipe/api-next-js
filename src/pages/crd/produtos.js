import { useState, useEffect } from 'react';
import Link from 'next/link';
import {encode, decode} from 'uint8-to-base64';
    
export default function Produtos(){
  const {encode, decode} = require('uint8-to-base64');


  //pega produtos pra exibir na lista
  const [data, setData] = useState([]);
  
  useEffect(() => {
    fetch('/api/produtos/0', { headers: {'id':'1', 'tk':'7cea26600c288a7055229a1d7e9ba49b'}, method: 'GET'})
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      });
  }, []);
 
  var Produtos = data.TBProduto;
  
  function img(buf){
    const uint = new Uint8Array(buf.data.length);
    for(let i = 0; i < buf.data.length; i++){
      uint[i] = buf.data.at(i);
    }
    let encoded = encode(uint);
    encoded = encoded.replace("dataimage/jpegbase64", "data:image/jpeg;base64,")
    return encoded;
  }

  //pega categorias para o select do form lá embaixo
  const [data2, setData2] = useState([]);
 
  useEffect(() => {
    fetch('/api/categorias/0', { headers: {'id':'1', 'tk':'7cea26600c288a7055229a1d7e9ba49b'}, method: 'GET'})
      .then((res) => res.json())
      .then((data2) => {
        setData2(data2);
      });
  }, []);
 
  var Categorias = data2.TBCategoria;

  function reader(file, callback) {
    const fr = new FileReader();
    fr.onload = () => callback(null, fr.result);
    fr.onerror = (err) => callback(err);
    fr.readAsDataURL(file);
  }
  

  async function criar(e){
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    
    reader(formData.get("FotoProduto"), (err, res) => {
      formData.set("FotoProduto", res);
      fetch('/api/produtos/0', { headers: {'Content-Type': 'multipart/form-data', 'id':'1', 'tk':'7cea26600c288a7055229a1d7e9ba49b'}, method: form.method, body: formData})
      .then((response) => {
        if(response.ok){
          alert('Produto adicionado');
          location.reload();
        }
        else{
          alert('Falha ao adicionar o novo produto :/');
        }
      });  
    });
    
  }

  const apagar = async idP =>{
    if (confirm("Deseja apagar o produto "+idP+" ?") == true) {
      const response = await fetch(`/api/produtos/${idP}`, { headers: {'id':'1', 'tk':'7cea26600c288a7055229a1d7e9ba49b'}, method: 'DELETE'});
      const data = await response.json();
      alert(`Produto com ID: ${data.data} excluído com sucesso!`);
      location.reload();
    }
  }
  if(Produtos){
    console.log(Produtos);
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
                <img src={img(produto.FotoProduto)} alt='Foto Produto'></img>                
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
      <label for="FotoProduto">Foto: </label>
      <input type="file" name="FotoProduto" id="FotoProduto" required/>
      </div>
      <div>
        <label for="Categoria">Categoria: </label>
        <select id="Categoria" name="Categoria" required>
          <option value={""}>Selecionar</option>
          {Categorias?.map(categoria =>
            <option key={categoria.IDCategoria} value={categoria.IDCategoria}>{categoria.NomeCategoria} ({categoria.Descricao})</option>  
          )}
        </select>
      </div>
      <button type='submit'>Adicionar produto</button>
    </form>  
    </>;
}