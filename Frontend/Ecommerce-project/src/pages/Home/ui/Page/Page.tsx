import { FC, useEffect, useState } from "react"
// import axios from "axios"
import { fetchAuthApi } from "@/components";
import React from "react";
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";


interface Produto {
  id: number;
  nome: string;
  descricao: string;
  categoria: string;
  preco: number;
  estoque: number;
  imagem: string;
}

const Home: FC = () => {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const refreshtoken = localStorage.getItem("refresh_token");
        const produtosData = await fetchAuthApi(`${import.meta.env.VITE_URL}/produtos/`, refreshtoken, navigate );

        const produtosComCategoria = await Promise.all( produtosData.map(async (produto: Produto) => {
          const catResponse = await fetchAuthApi(`${import.meta.env.VITE_URL}/categorias/${produto.categoria}/`, refreshtoken, navigate );
          return {
            ...produto,
            categoria: catResponse.nome, // Atribuir nome da categoria
          };
        }));

        setProdutos(produtosComCategoria);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    };

    fetchProdutos();
  }, [navigate]);

  return (
    <>
      <section>
        <div className="hero min-h-[calc(100vh-64px)] bg-base-200">
          <div className="hero-content flex flex-col gap-4 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full">
              {produtos.map((produto) => (
                <React.Fragment key={produto.id}>
                  <div className="max-w-xs mx-auto"> {/* Limita a largura do card */}
                    <Link to={`produto/${produto.id}`}>
                      <div className="hover:scale-105 duration-300">
                        <img src={produto.imagem} className="w-64 h-64 object-cover rounded-t-lg shadow-2xl" />
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

export default Home;
