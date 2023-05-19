import Link from 'next/link';

export default function main(){
    return <>
        <div id="ccdr">
            <h1>Bem vindo</h1>
        </div>
        <div id="links">
            <p>Clique para editar:</p>
            <Link href={"crd/produtos"}>Produtos</Link>
            <Link href={"crd/precos"}>Precos</Link>
            <Link href={"crd/mercados"}>Mercados</Link>
            <Link href={"crd/cidades"}>Cidades</Link>
            <Link href={"crd/estados"}>Estados</Link>
        </div>
    </>
}