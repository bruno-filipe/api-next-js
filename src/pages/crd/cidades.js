import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Produtos(){
  const [data, setData] = useState([]);
  
  useEffect(() => {
    fetch('/api/cidades/0', { method: 'GET', headers: { 'id':'4', 'tk':'7cea26600c288a7055229a1d7e9ba49b' } } )
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      });
  }, []);
 
  var Cidades = data.TBCidade;
  function criar(e){
    e.preventDefault();
    const Nome = document.getElementById("NomeCidade").value;
    const Cod = document.getElementById("CodUF").value;
    
    const form = e.target;
    const obj = {CodUF: Cod, NomeCidade: Nome};
    const formJson = JSON.stringify(obj);
    fetch('/api/cidades/0', { method: form.method, body: formJson, headers: {'Content-Type': 'application/json', 'id':'4', 'tk':'7cea26600c288a7055229a1d7e9ba49b' } }) 
    .then((response) => {
      if(response.ok){
        alert('Cidade adicionada');
        location.reload();
      }
      else{
        alert('Falha ao adicionar a nova cidade :/');
      }
    });
  }

  const apagar = async idP =>{
    if (confirm("Deseja apagar a cidade "+idP+" ?") == true) {
      const response = await fetch(`/api/cidades/${idP}`, { method: 'DELETE', headers: { 'id':'4', 'tk':'7cea26600c288a7055229a1d7e9ba49b' } } );
      const data = await response.json();
      alert(`Cidade com ID: ${data.data} excluída com sucesso!`);
      location.reload();
    }
  }

  return <>
    <div id='ccrd'>
      <Link href={{pathname: '../'}}>⬅</Link>
      <h1>Lista de Cidades</h1>
    </div>
    <div>
        <ul>{
          Cidades?.map(Cidade =>
              <li key={Cidade.IDCidade}>
                <div className='texto'>
                  <h2>
                    <b>{Cidade.NomeCidade} - {Cidade.CodUF}</b>
                  </h2>
                </div>
                <div className='ud'>
                  <button onClick={() => {apagar(Cidade.IDCidade)}}>Apagar</button>
                  
                  <Link id="atl" href={{pathname: '/u/cidade', query: Cidade}}><p>Atualizar</p></Link>
                </div>
              </li>
          )}
        </ul>
    </div>
    <form method="post" onSubmit={criar} id="enviar">
      <div>
        <div>
            <label for="NomeCidade">Nome: </label>
            <input type="text" name="NomeCidade" id="NomeCidade" placeholder='Barretos' required/>
        </div>
        <div>
            <label for="CodUF">CodUF: </label>
            <input type="text" name="CodUF" id="CodUF" placeholder="SP" required/>
        </div>
      </div>
      <button type='submit'>Adicionar Cidade</button>
    </form>  
    </>;
}