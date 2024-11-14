import { FC, useEffect, useState } from "react"
import axios from "axios"
import { useParams } from "react-router-dom";

interface Produto {
  id: number;
  nome: string;
  descricao: string;
  categoria: number;
  preco: number;
  estoque: number;
  imagem: string;
}

interface dadosProduto {
  nome: string;
  descricao: string;
  categoria: string;
  preco: number;
  estoque: number;
  imagem: string;
}

interface Categoria {
    id: number
    nome: string
  }

const Produto: FC = () => {
  const [produtos, setProdutos] = useState<Produto>({} as Produto)
  const [categorias, setCategorias] = useState<Categoria>({} as Categoria)
  const {id_produto} = useParams<{ id_produto: string }>();

  useEffect(() => {
    const fetchProduto = async () => {
      const response = await axios.get(`${import.meta.env.VITE_URL}/produtos/${id_produto}/`)
      const produtos = await response.data
      setProdutos(produtos)
    }
    fetchProduto()
  }, [id_produto])

  return (
    <>
      <section>
        <div className="hero min-h-[calc(100vh-64px)] bg-base-200">
            <div className="grid grid-cols-2 gap-4 items-center justify-center h-full px-4">
                {/* Coluna esquerda */}
                <div className="flex justify-center items-center">
                <img src={produtos.imagem} className="w-64 h-64 object-cover rounded-lg shadow-2xl"></img>
                </div>

                {/* Coluna direita */}
                <div className="flex-col ml-4">
                {/* Coloque aqui o conteúdo da segunda coluna */}
                <h1 className="text-2xl font-bold">{produtos.nome}</h1>
                <p>{produtos.descricao}</p>
                <h1>{produtos.categoria}</h1>
                <h1>{produtos.preco}</h1>
                <h1>{produtos.nome}</h1>
                <h1>{produtos.nome}</h1>


                </div>
            </div>
        </div>
      </section>
    </>
  );
};

export default Produto;
