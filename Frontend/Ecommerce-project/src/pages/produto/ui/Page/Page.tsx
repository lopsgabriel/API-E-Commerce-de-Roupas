import { FC, useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import { fetchAuthApi } from "@/components";
import { useNavigate } from "react-router-dom";

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

const Produto: FC = () => {
  const [produto, setProduto] = useState<dadosProduto>({} as dadosProduto)
  const {id_produto} = useParams<{ id_produto: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduto = async () => {
      const refresh_token = localStorage.getItem('refresh_token')
      const produtoData = await fetchAuthApi(`${import.meta.env.VITE_URL}/produtos/${id_produto}/`, refresh_token, navigate)

      const cat_response = await fetchAuthApi(`${import.meta.env.VITE_URL}/categorias/${produtoData.categoria}/`, refresh_token, navigate);
      const categoria = await cat_response

      
      setProduto({
        ...produtoData,
        categoria: categoria.nome, // Atribui o nome da categoria
      });
    }
    fetchProduto()
  }, [id_produto, navigate])

  return (
    <>
      <section>
        <div className="hero min-h-[calc(100vh-64px)] bg-base-200">
            <div className="grid grid-cols-2 gap-4 items-center justify-center h-full px-4">
                {/* Coluna esquerda */}
                <div className="flex justify-center items-center">
                <img src={produto.imagem} className="w-64 h-64 object-cover rounded-lg shadow-2xl"></img>
                </div>

                {/* Coluna direita */}
                <div className="flex-col ml-4">
                {/* Coloque aqui o conteúdo da segunda coluna */}
                <h1 className="text-2xl font-bold">{produto.nome}</h1>
                <p>{produto.descricao}</p>
                <h1>{produto.categoria}</h1>
                <h1>{produto.preco}</h1>
                <h1>{produto.nome}</h1>
                <h1>{produto.nome}</h1>


                </div>
            </div>
        </div>
      </section>
    </>
  );
};

export default Produto;
