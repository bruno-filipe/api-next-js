import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Update(){

  const [data2, setData2] = useState([]);
 
  useEffect(() => {
    fetch('/api/categorias/0', { headers: {'id':'1', 'tk':'7cea26600c288a7055229a1d7e9ba49b'}, method: 'GET'})
      .then((res) => res.json())
      .then((data2) => {
        setData2(data2);
      });
  }, []);
 
  var Categorias = data2.TBCategoria;


  const router = useRouter();
  const data = router.query;
  
  const idP = data.IDProduto;

  function reader(file, callback) {
    const fr = new FileReader();
    fr.onload = () => callback(null, fr.result);
    fr.onerror = (err) => callback(err);
    fr.readAsDataURL(file);
  }
  
  function atualizar(e){
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    
    reader(formData.get("FotoProduto"), (err, res) => {
      formData.set("FotoProduto", res);
      fetch('/api/produtos/'+idP, { headers: {'Content-Type': 'multipart/form-data', 'id':'1', 'tk':'7cea26600c288a7055229a1d7e9ba49b'}, method: "PUT", body: formData})
      .then((response) => {
        if(response.ok){
          alert('Produto adicionado');
          history.back();
        }
        else{
          alert('Falha ao adicionar o novo produto :/');
        }
      });  
    });
  }

  return<>
    <div id='cabecalho'>
      <Link href={{pathname: '../crd/produtos'}}>⬅</Link>
      <h1>Atualizar produto {data.NomeProduto}</h1>
    </div>
    <form method="post" onSubmit={atualizar} id="atualizar">
      <div>
      <label for="NomeProduto">Nome: </label>
      <input type="text" name="NomeProduto" id="NomeProduto" placeholder={data.NomeProduto} required/>
      </div>
      <div>
      <label for="DescricaoProduto">Descricao: </label>
      <input type="text" name="DescricaoProduto" id="DescricaoProduto" placeholder={data.DescricaoProduto} required/>
      </div>
      <div>
      <label for="Medida">Medida: </label>
      <input type="text" name="Medida" id="Medida" placeholder={data.Medida}/>
      </div>
      <div>
      <label for="MarcaProduto">Marca: </label>
      <input type="text" name="MarcaProduto" id="MarcaProduto" placeholder={data.MarcaProduto} required/>
      </div>
      <div>
        <label for="FotoProduto">Foto: </label>
        <input type='file' name='FotoProduto' id='FotoProduto'></input>
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
      <button type='submit'>Atualizar produto</button>
    </form>  

  </>
}