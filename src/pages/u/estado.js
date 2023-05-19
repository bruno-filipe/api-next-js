import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Update(){
  const router = useRouter();
  const data = router.query;
  
  const idP = data.IDUF;

  function atualizar(e){
    e.preventDefault();
    const ID = document.getElementById("IDUF").value;
    const Nome = document.getElementById("NomeEstado").value;
    
    const form = e.target;
    const obj = {IDUF: ID, NomeEstado: Nome};
    const formJson = JSON.stringify(obj);
    fetch('/api/estados/'+idP, { headers: {'Content-Type': 'application/json'}, method: 'PUT', body: formJson })
    .then((response) => {
      if(response.ok){
        alert('Estado atualizado')
        window.location.href="../crd/estados";
      }
      else{
        alert('Falha ao atualizar o estado :/');
      }
    });
  }
  return<>
    <div id='cabecalho'>
      <Link href={{pathname: '../crd/estados'}}>⬅</Link>
      <h1>Atualizar Estado {data.NomeEstado}</h1>
    </div>
    <form method="put" onSubmit={atualizar} id="enviar">
      <div>
        <div>
            <label for="IDUF">IDUF: </label>
            <input type="text" name="IDUF" id="IDUF" placeholder={data.IDUF} required/>
        </div>
        <div>
            <label for="NomeEstado">Nome: </label>
            <input type="text" name="NomeEstado" id="NomeEstado" placeholder={data.NomeEstado} required/>
        </div>
      </div>
      <button type='submit'>Atualizar estado</button>
    </form>  
  </>
}