import { FC, useEffect, useState } from "react";
import { fetchAuthApi } from "@/components";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

// Interface para definir os tipos de dados do produto
interface Produto {
  id: number;
  nome: string;
  descricao: string;
  categoria: string;
  preco: number;
  estoque: number;
  imagem: string;
}

/**
 * Componente para exibir os produtos de uma categoria específica.
 * Faz uma requisição para buscar todos os produtos e filtra pela categoria 
 * passada na URL. Exibe os produtos encontrados com suas informações.
 */
const Categoria: FC = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const { categoria } = useParams<{ categoria: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    /**
     * Função para buscar produtos da API e filtrar pela categoria.
     * Primeiro busca todos os produtos e, em seguida, para cada produto,
     * faz uma nova requisição para obter o nome da categoria. 
     * Filtra os produtos que pertencem à categoria atual.
     */
    const fetchProdutos = async () => {
      try {
        const refreshtoken = localStorage.getItem("refresh_token");
        const produtosData = await fetchAuthApi(`${import.meta.env.VITE_URL}/produtos/`, refreshtoken, navigate);

        const produtosComCategoria = await Promise.all(
          produtosData.map(async (produto: Produto) => {
            const catResponse = await fetchAuthApi(
              `${import.meta.env.VITE_URL}/categorias/${produto.categoria}/`,
              refreshtoken,
              navigate
            );
            return {
              ...produto,
              categoria: catResponse.nome,
            };
          })
        );
        // Filtra produtos pela categoria recebida na URL
        setProdutos(produtosComCategoria.filter((produto) => produto.categoria === categoria));
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    };

    fetchProdutos();
  }, [navigate, categoria]);

  return (
    <>
      <section>
        <div className="hero min-h-[calc(100vh-64px)] items-start bg-base-200">
          <div className="hero-content flex flex-col gap-4 w-full">
            <h1 className="text-5xl font-light pb-4 text-grey-600 hover:text-gray-300">{categoria}</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {produtos.map((produto) => (
                <React.Fragment key={produto.id}>
                  <div className="w-52">
                    <a href={`../produto/${produto.id}`}>
                      <div className="hover:scale-105 duration-300">
                        <img src={produto.imagem} className="w-52 h-52 object-cover rounded-t-lg shadow-2xl" />
                        <div className="bg-white p-4 rounded-b-lg">
                          <p className="text-sm font-light text-gray-700 opacity-90 pt-1">{produto.categoria}</p>
                          <h1 className="text-xl text-gray-800 font-bold truncate max-w-[220px]">{produto.nome}</h1>
                          <p className="px-1 py-0.5 text-lg font-light text-gray-800 rounded-xl inline-block">
                            R${produto.preco}
                          </p>
                        </div>
                      </div>
                    </a>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Categoria;
