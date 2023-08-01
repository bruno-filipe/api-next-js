import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Update(){
  const router = useRouter();
  const data = router.query;
  
  const idP = parseInt(data.IDCidade);

  function atualizar(e){
    e.preventDefault();
    const Cod = document.getElementById("CodUF").value;
    const Nome = document.getElementById("NomeCidade").value;
    
    const form = e.target;
    const obj = {CodUF: Cod, NomeCidade: Nome};
    const formJson = JSON.stringify(obj);
    fetch('/api/cidades/'+idP, { headers: {'Content-Type': 'application/json', 'id':'4', 'tk':'7cea26600c288a7055229a1d7e9ba49b' }, method: 'PUT', body: formJson })
    .then((response) => {
      if(response.ok){
        alert('Cidade atualizada');
        window.location.href="../crd/cidades";
      }
      else{
        alert('Falha ao atualizar a cidade :/');
      }
    });
  }
  return<>
    <div id='cabecalho'>
      <Link href={{pathname: '../crd/cidades'}}>⬅</Link>
      <h1>Atualizar cidade {data.NomeCidade}</h1>
    </div>
    <form method="put" onSubmit={atualizar} id="enviar">
      <div>
        <div>
            <label for="NomeCidade">Nome: </label>
            <input type="text" name="NomeCidade" id="NomeCidade" placeholder={data.NomeCidade} required/>
        </div>
        <div>
            <label for="CodUF">CodUF: </label>
            <input type="text" name="CodUF" id="CodUF" placeholder={data.CodUF} required/>
        </div>
      </div>
      <button type='submit'>Atualizar cidade</button>
    </form>  
  </>
}