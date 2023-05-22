import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Produtos(){
  const [data, setData] = useState([]);
  
  useEffect(() => {
    fetch('/api/mercados/0', { method: 'GET'})
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      });
  }, []);
 
  var Mercados = data.TBMercado;
  

  const [data2, setData2] = useState([]);
    
  useEffect(() => {
      fetch('/api/cidades/0', { method: 'GET'})
      .then((res) => res.json())
      .then((data2) => {
          setData2(data2);
      });
  }, []);
  const Cidades = data2.TBCidade
  
  function getCidade(id){
    const Cidade = Cidades?.filter(cidade => cidade.IDCidade === parseInt(id))
    const re = `${Cidade[0].NomeCidade} - ${Cidade[0].CodUF}`;
    return re;
  }
  function criar(e){
    e.preventDefault();
    const Cod = document.getElementById("CodCidade").value;
    const Nome = document.getElementById("NomeMercado").value;
    
    const form = e.target;
    const obj = {CodCidade: Cod, NomeMercado: Nome};
    const formJson = JSON.stringify(obj);
    fetch('/api/mercados/0', { headers: {'Content-Type': 'application/json'}, method: form.method, body: formJson })
    .then((response) => {
      if(response.ok){
        alert('Mercado adicionado');
        location.reload();
      }
      else{
        alert('Falha ao adicionar o novo mercado :/');
      }
    });
  }

  const apagar = async idP =>{
    if (confirm("Deseja apagar o mercado "+idP+" ?") == true) {
      const response = await fetch(`/api/mercados/${idP}`, { method: 'DELETE' });
      const data = await response.json();
      alert(`Mercado com ID: ${data.data} excluído com sucesso!`);
      location.reload();
    }
  }

  return <>
    <div id='ccrd'>
      <Link href={{pathname: '../'}}>⬅</Link>
      <h1>Lista de Mercados</h1>
    </div>
    <div>
        <ul>{
          Mercados?.map(mercado =>
              <li key={mercado.IDMercado}>
                <div className='texto'>
                  <h2>
                    <b>{mercado.NomeMercado}</b> de {getCidade(mercado.CodCidade)}
                  </h2>
                </div>
                <div className='ud'>
                  <button onClick={() => {apagar(mercado.IDMercado)}}>Apagar</button>
                  
                  <Link id="atl" href={{pathname: '/u/mercado', query: mercado}}><p>Atualizar</p></Link>
                </div>
              </li>
          )}
        </ul>
    </div>
    <form method="post" onSubmit={criar} id="enviar">
      <div>
        <div>
            <label for="NomeMercado">Nome: </label>
            <input type="text" name="NomeMercado" id="NomeMercado" placeholder='Savegnago' required/>
        </div>
        <div>
            <label for="CodCidade">Cidade: </label>
            <select id="CodCidade" required>
                <option value="">Selecionar</option>
                {Cidades?.map(cidade => <option value={cidade.IDCidade}>{cidade.NomeCidade}</option>)}
            </select>
        </div>
      </div>
      <button type='submit'>Adicionar mercado</button>
    </form>  
    </>;
}