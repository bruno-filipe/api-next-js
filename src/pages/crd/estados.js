import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Produtos(){
  const [data, setData] = useState([]);
  
  useEffect(() => {
    fetch('/api/estados/0', { method: 'GET'})
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      });
  }, []);
 
  var Estados = data.TBEstado;
  function criar(e){
    const ID = document.getElementById("IDUF").value;
    const Nome = document.getElementById("NomeEstado").value;
    
    const form = e.target;
    const obj = {IDUF: ID, NomeEstado: Nome};
    const formJson = JSON.stringify(obj);
    fetch('/api/estados/0', { headers: {'Content-Type': 'application/json'}, method: form.method, body: formJson })
    .then((response) => {
      if(response.ok){
        alert('Estado adicionado')
      }
      else{
        alert('Falha ao adicionar o novo estado :/');
      }
    });
  }

  const apagar = async idP =>{
    if (confirm("Deseja apagar o estado "+idP+" ?") == true) {
      const response = await fetch(`/api/estados/${idP}`, { method: 'DELETE' });
      const data = await response.json();
      alert(`Estado com IDUF: ${data.data} excluído com sucesso!`);
      location.reload();
    }
  }

  return <>
    <div id='ccrd'>
      <Link href={{pathname: '../'}}>⬅</Link>
      <h1>Lista de estados</h1>
    </div>
    <div>
        <ul>{
          Estados?.map(estado =>
              <li key={estado.IDUF}>
                <div className='texto'>
                  <h2>
                    <b>{estado.IDUF + ' ' + estado.NomeEstado}</b>
                  </h2>
                </div>
                <div className='ud'>
                  <button onClick={() => {apagar(estado.IDUF)}}>Apagar</button>
                  
                  <Link id="atl" href={{pathname: '/u/estado', query: estado}}><p>Atualizar</p></Link>
                </div>
              </li>
          )}
        </ul>
    </div>
    <form method="post" onSubmit={criar} id="enviar">
      <div>
        <div>
            <label for="IDUF">IDUF: </label>
            <input type="text" name="IDUF" id="IDUF" placeholder="ES" required/>
        </div>
        <div>
            <label for="NomeEstado">Nome: </label>
            <input type="text" name="NomeEstado" id="NomeEstado" placeholder='Espírito Santo' required/>
        </div>
      </div>
      <button type='submit'>Adicionar estado</button>
    </form>  
    </>;
}