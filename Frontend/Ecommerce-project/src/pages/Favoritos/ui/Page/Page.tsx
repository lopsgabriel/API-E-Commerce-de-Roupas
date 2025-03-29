import { FC, useEffect, useState } from "react"
import { fetchAuthApi } from "@/components";
import React from "react";
import { useNavigate } from "react-router-dom";

interface ProdutosWishlist {
  id: number;
  usuario: number;
  usuario_nome: string;
  produto: number;
  produto_nome: string;
}

interface ProdutoW {
  id: number;
  nome: string;
  descricao: string;
  preco: string;
  estoque: number;
  categoria: string;
  imagem: string;
}

/**
 * Componente de exibição dos produtos na lista de desejos (favoritos).
 * Realiza uma requisição para buscar os produtos favoritados pelo usuário logado.
 * 
 * Utiliza o React Hook useEffect para fazer a busca dos dados ao carregar o componente
 * e exibe uma lista de produtos com informações como nome, descrição, preço e categoria.
 * 
 * O usuário pode visualizar seus favoritos e clicar em um produto para ver mais detalhes.
 */
const Favoritos: FC = () => {
  // Estado que armazena os produtos da wishlist
  const [produtos_wishlist, setProdutos_wishlist] = useState<ProdutoW[]>([]);
  
  // Navegação para outras páginas
  const navigate = useNavigate();

  useEffect(() => {
    /**
     * Função para buscar os produtos da wishlist do usuário logado.
     * Realiza requisições para as APIs de lista de desejos, produtos e categorias.
     */
    const fetchProdutosWishlist = async () => {
      try {
        // Obtém o ID do usuário e o refresh token do localStorage
        const userId = localStorage.getItem("user_id");
        const refreshtoken = localStorage.getItem("refresh_token");

        // Faz requisição para obter os produtos na lista de desejos
        const produtosData = await fetchAuthApi(`${import.meta.env.VITE_URL}/listaDesejos/${userId}/`, refreshtoken, navigate);

        console.log(produtosData);

        // Mapeia os dados da wishlist para incluir as informações dos produtos e suas categorias
        const listaProdutos = await Promise.all(
          produtosData.map(async (carrinho: ProdutosWishlist) => {
            const produto = await fetchAuthApi(`${import.meta.env.VITE_URL}/produtos/${carrinho.produto}/`, refreshtoken, navigate);
            const catResponse = await fetchAuthApi(`${import.meta.env.VITE_URL}/categorias/${produto.categoria}/`, refreshtoken, navigate );
            return {
              ...produto,
              categoria: catResponse.nome, 
            };
          })
        )

        // Atualiza o estado com a lista de produtos
        setProdutos_wishlist(listaProdutos);
      } catch (error) {
        // Tratamento de erro caso a requisição falhe
        console.error("Erro ao buscar produtos:", error);
      }
    };

    // Chama a função para buscar os produtos
    fetchProdutosWishlist();
  }, [navigate]);

  return (
    <>
      <section>
        <div className="hero min-h-[calc(100vh-64px)] items-start bg-base-200">
          <div className="hero-content flex flex-col gap-4 w-full">
            <h1 className="text-5xl font-light pb-4 text-grey-600 hover:text-gray-300">Favoritos</h1>
            {produtos_wishlist.length === 0 && (
              <div className="w-full flex items-center justify-center">
                <h1 className="text-2xl font-light text-white opacity-90">Nenhum favorito ainda</h1>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {produtos_wishlist.map((produto) => (
                <React.Fragment key={produto.id}>
                    <div className="w-52"> 
                    <a href={`produto/${produto.id}`}>
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

export default Favoritos;
