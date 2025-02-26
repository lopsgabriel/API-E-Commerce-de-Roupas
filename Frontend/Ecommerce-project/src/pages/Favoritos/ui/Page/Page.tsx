import { FC, useEffect, useState } from "react"
import { fetchAuthApi } from "@/components";
import React from "react";
import { Link } from 'react-router-dom';
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

const Favoritos: FC = () => {
  const [produtos_wishlist, setProdutos_wishlist] = useState<ProdutoW[]>([]);
  const navigate = useNavigate()
  useEffect(() => {
    const fetchProdutosWishlist = async () => {
      try {
        const userId = localStorage.getItem("user_id");
        const refreshtoken = localStorage.getItem("refresh_token");
        const produtosData = await fetchAuthApi(`${import.meta.env.VITE_URL}/listaDesejos/${userId}/`, refreshtoken, navigate);
        console.log(produtosData)
        const listaProdutos = await Promise.all(
          produtosData.map(async (carrinho: ProdutosWishlist) => {
            const produto = await fetchAuthApi(`${import.meta.env.VITE_URL}/produtos/${carrinho.produto}/`, refreshtoken, navigate);
            return produto
          })
        ) 
        setProdutos_wishlist(listaProdutos);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    };
    fetchProdutosWishlist();
  }, [navigate]);

  return (
    <>
      <section>
        <div className="hero min-h-[calc(100vh-64px)] items-start bg-base-200">
          <div className="hero-content flex flex-col gap-4 w-full">
            <h1 className="text-5xl font-light pb-4 text-grey-600 hover:text-gray-300">Favoritos</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {produtos_wishlist.map((produto) => (
                <React.Fragment key={produto.id}>
                    <div className="w-52"> 
                    <Link to={`produto/${produto.id}`}>
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
                    </Link>
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