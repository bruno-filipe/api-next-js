import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Update(){
  const [data2, setData2] = useState([]);
    
  useEffect(() => {
      fetch('/api/cidades/0', { method: 'GET', headers: {'id':'1', 'tk':'7cea26600c288a7055229a1d7e9ba49b'}})
      .then((res) => res.json())
      .then((data2) => {
          setData2(data2);
      });
  }, []);
  const Cidades = data2.TBCidade


  const router = useRouter();
  const data = router.query;
  
  const idP = parseInt(data.IDMercado);

  function atualizar(e){
    e.preventDefault();
    const Cod = document.getElementById("CodCidade").value;
    const Nome = document.getElementById("NomeMercado").value;
    
    const form = e.target;
    const obj = {CodCidade: Cod, NomeMercado: Nome};
    const formJson = JSON.stringify(obj);
    fetch('/api/mercados/'+idP, { headers: {'Content-Type': 'application/json', 'id':'1', 'tk':'7cea26600c288a7055229a1d7e9ba49b'}, method: 'PUT', body: formJson })
    .then((response) => {
      if(response.ok){
        alert('Mercado atualizado');
        window.location.href="../crd/mercados";
      }
      else{
        alert('Falha ao atualizar o mercado :/');
      }
    });
  }
  return<>
    <div id='cabecalho'>
      <Link href={{pathname: '../crd/mercados'}}>⬅</Link>
      <h1>Atualizar Mercado {data.NomeMercado}</h1>
    </div>
    <form method="put" onSubmit={atualizar} id="enviar">
      <div>
        <div>
            <label for="NomeMercado">Nome: </label>
            <input type="text" name="NomeMercado" id="NomeMercado" placeholder={data.NomeMercado} required/>
        </div>
        <div>
            <label for="CodCidade">Cidade: </label>
            <select id="CodCidade" required>
                <option value="">Selecionar</option>
                {Cidades?.map(cidade => <option value={cidade.IDCidade}>{cidade.NomeCidade}</option>)}
            </select>
        </div>
      </div>
      <button type='submit'>Atualizar mercado</button>
    </form>  
  </>
}