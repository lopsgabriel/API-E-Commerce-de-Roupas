import { FC, useEffect, useState } from "react"
import { fetchAuthApi } from "@/components";
import React from "react";
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { VscHeart } from "react-icons/vsc";
import "../../../../app/index.css/"
import axios from "axios";
import { VscHeartFilled } from "react-icons/vsc";

interface Produto {
  id: number;
  nome: string;
  descricao: string;
  categoria: string;
  preco: number;
  estoque: number;
  imagem: string;
}

interface ListaDesejo {
  usuario: number | null,
  usuario_nome: string,
  produto: number,
  produto_nome: string
}

const Home: FC = () => {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [categorias, setCategorias] = useState<string[]>([])
  const [listaDesejos, setListaDesejos] = useState<ListaDesejo[]>([])
  const navigate = useNavigate()
  const user_id = localStorage.getItem("user_id");

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const refreshtoken = localStorage.getItem("refresh_token");
        const produtosData = await fetchAuthApi(`${import.meta.env.VITE_URL}/produtos/`, refreshtoken, navigate );

        const listaDesejosData = await fetchAuthApi(`${import.meta.env.VITE_URL}/listaDesejos/${user_id}`, refreshtoken, navigate );
        setListaDesejos(listaDesejosData.map((produto: ListaDesejo) => ({ produto: produto.produto })));

        const produtosComCategoria = await Promise.all( produtosData.map(async (produto: Produto) => {
          const catResponse = await fetchAuthApi(`${import.meta.env.VITE_URL}/categorias/${produto.categoria}/`, refreshtoken, navigate );
          return {
            ...produto,
            categoria: catResponse.nome, 
          };
        }));


        setCategorias([...new Set(produtosComCategoria.map((produto) => produto.categoria))]);
        setProdutos(produtosComCategoria);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    };
    fetchProdutos();
  }, [navigate, user_id]);

  async function toggleWishlist(produtoId: number) {
    try {
      const refreshtoken = localStorage.getItem("access_token");
  
      // Verificar se o produto ta na lista de desejos
      const isInListaDesejos = listaDesejos.some(item => item.produto === produtoId);
  
      if (isInListaDesejos) {
        // Remover da lista de desejos
        await axios.delete(`${import.meta.env.VITE_URL}/listaDesejos/${user_id}/${produtoId}/`, {
          headers: { 'Authorization': `Bearer ${refreshtoken}` }
        });
        setListaDesejos((prev) => prev.filter(item => item.produto !== produtoId));
      } else {
        await axios.post(
          `${import.meta.env.VITE_URL}/listaDesejos/${user_id}/`,
          {
            produto: produtoId,
            usuario: user_id,
          },
          { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${refreshtoken}` } }
        );
        setListaDesejos((prev) => [...prev, { usuario: Number(user_id), usuario_nome: "", produto: produtoId, produto_nome: "" }])
      }
    } catch (error) {
      console.error("Erro ao atualizar a lista de desejos", error);
    }
  }
  

  return (
    <>
      <section>
        <div className="hero min-h-[calc(100vh-64px)] bg-base-200">
          <div className="hero-content flex flex-col gap-4 w-full">
            {categorias.map((categoria) => (
              <div key={categoria}>
                <div className="flex ">
                  <a  href={`/categoria/${categoria}`} className="text-3xl text-gray-500 font-light hover:text-gray-300 duration-100 pb-4">{categoria}</a>
                </div>
                <div className="grid grid-cols- sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {produtos.filter((produto) => produto.categoria === categoria).map((produto) => (
                    <React.Fragment key={produto.id}>
                      <div className="w-52 relative">
                        <div className="relative hover:scale-105 duration-300">
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              toggleWishlist(produto.id);
                            }}
                            className="absolute right-4 top-4 hover:scale-110 duration-100 text-black icon-heart z-10"
                          >
                            {
                              listaDesejos.some((item) => item.produto === produto.id) ? (
                                <VscHeartFilled size={20} />
                              ) : (
                                <VscHeart size={20} />
                             )
                            }
                          </button>
                          <Link to={`produto/${produto.id}`}>
                            <img
                              src={produto.imagem}
                              className="w-52 h-52 object-cover rounded-t-lg shadow-2xl"
                            />
                            <div className="bg-white p-4 rounded-b-lg">
                              <div className="flex justify-between">
                                <p className="text-sm font-light text-gray-700 opacity-90 pt-1">
                                  {produto.categoria}
                                </p>
                              </div>
                              <h1 className="text-xl text-gray-800 font-bold truncate max-w-[220px]">
                                {produto.nome}
                              </h1>
                              <p className="px-1 py-0.5 text-lg font-light text-gray-800 rounded-xl inline-block">
                                R${produto.preco}
                              </p>
                            </div>
                          </Link>
                        </div>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;