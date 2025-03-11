import { FC, useEffect, useState } from "react"
import { fetchAuthApi } from "@/components";
import React from "react";
import { useNavigate } from "react-router-dom";
import { VscHeart } from "react-icons/vsc";
import "../../../../app/index.css/"
import axios from "axios";
import { VscHeartFilled } from "react-icons/vsc";
import { TbShoppingCartCopy, TbShoppingCartPlus } from "react-icons/tb";

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

interface ProdutosCarrinho {
  usuario: number;
  produto: number;
  quantidade: number;
}

const Home: FC = () => {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [categorias, setCategorias] = useState<string[]>([])
  const [listaDesejos, setListaDesejos] = useState<ListaDesejo[]>([])
  const [listaCarrinho, setListaCarrinho] = useState<ProdutosCarrinho[]>([])
  const navigate = useNavigate()
  const user_id = localStorage.getItem("user_id");

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const refreshtoken = localStorage.getItem("refresh_token");
        const produtosData = await fetchAuthApi(`${import.meta.env.VITE_URL}/produtos/`, refreshtoken, navigate );

        const listaCarrinhoData = await fetchAuthApi(`${import.meta.env.VITE_URL}/carrinhos/${user_id}/`, refreshtoken, navigate );
        setListaCarrinho(listaCarrinhoData.map((produto: ProdutosCarrinho) => ({ produto: produto.produto })));
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


  async function togglelist(produtoId: number, listType: "carrinhos" | "listaDesejos") {

    const listas: Record<string, { produto: number }[]> = {
      carrinhos: listaCarrinho.map((item) => ({ produto: item.produto })),
      listaDesejos: listaDesejos.map((item) => ({ produto: item.produto }))
    };

    const setListas = {
      carrinhos: setListaCarrinho,
      listaDesejos: setListaDesejos
    };

    try {
      const refreshtoken = localStorage.getItem("access_token");
  
      // Verificar se o produto ta na lista 
      const lista = listas[listType];
      const isInLista = lista.some(item => item.produto === produtoId);
  
      if (isInLista) {
        // Remover da lista 
        await axios.delete(`${import.meta.env.VITE_URL}/${listType}/${user_id}/${produtoId}/`, {
          headers: { 'Authorization': `Bearer ${refreshtoken}` }
        });
        if (listType === "carrinhos") {
          setListas[listType]((prev: ProdutosCarrinho[]) => prev.filter(item => item.produto !== produtoId));
        } else {
          setListas[listType]((prev: ListaDesejo[]) => prev.filter(item => item.produto !== produtoId));
        }
      } else {
        if (listType === "carrinhos") {
          await axios.post(
            `${import.meta.env.VITE_URL}${listType}/${user_id}/`,
            {
              'usuario': user_id,
              'produto': produtoId,
              'quantidade': 1
            },
            { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${refreshtoken}` } }
          );
          setListas[listType]((prev: ProdutosCarrinho[]) => [...prev, { 
            'usuario': Number(user_id), 
            'produto': produtoId, 
            'quantidade': 1
          }]);
          console.log(setListas)
        } else {
          await axios.post(
            `${import.meta.env.VITE_URL}${listType}/${user_id}/`,
            {
              'usuario': user_id,
              'produto': produtoId
            },
            {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${refreshtoken}`
            }
            }
          )
          setListas[listType]((prev: ListaDesejo[]) => [...prev, { usuario: Number(user_id), usuario_nome: "", produto: produtoId, produto_nome: "" }]);
        }
        }
    } catch (error) {
      console.error("Erro ao atualizar a lista ", error);
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
                              togglelist(produto.id, "listaDesejos");
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
                          <a href={`produto/${produto.id}`}>
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
                              <div className="flex justify-between items-center ">
                                <p className="px-1 py-0.5 text-lg font-light text-gray-800 rounded-xl inline-block">
                                  R${produto.preco}
                                </p>

                                {produto.estoque === 0 ? (
                                    <p className="text-xs">Esgotado</p>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={(event) => {
                                        event.preventDefault();
                                        event.stopPropagation();
                                        togglelist(produto.id, "carrinhos");
                                      }}
                                      className="px-3  text-lg font-light text-gray-800 rounded-xl inline-block border-2 border-gray-950 hover:scale-110 absolute right-5 duration-100 z-10"
                                    >
                                      {listaCarrinho.some((item) => item.produto === produto.id) ? (
                                          <TbShoppingCartCopy size={18} />
                                        ) : (
                                          <TbShoppingCartPlus size={18} />
                                        )
                                      }
                                    </button>
                                  )}
                              </div>
                            </div>
                          </a>
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