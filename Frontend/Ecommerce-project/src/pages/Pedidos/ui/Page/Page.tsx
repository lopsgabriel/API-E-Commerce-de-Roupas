import { FC, useEffect, useState } from "react";
import { fetchAuthApi } from "@/components";
import React from "react";
import { useNavigate } from "react-router-dom";

interface ItemPedido {
  produto: number;
  quantidade: number;
  preco: string;
}

interface Pedido {
  id: number;
  usuario: number;
  itens: ItemPedido[];
  data_criacao: string;
  status: string;
}

interface Produto {
  id: number;
  nome: string;
  descricao: string;
  preco: string;
  estoque: number;
  categoria: string;
  imagem: string;
}

const Pedidos: FC = () => {
  /**
   * Componente de exibição de pedidos.
   * - Busca os pedidos do usuário logado e os produtos relacionados.
   * - Permite expandir os detalhes dos pedidos para mostrar os itens.
   * - Calcula o preço total de cada pedido.
   */
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [expandido, setExpandido] = useState<number | null>(null);

  const navigate = useNavigate();

  // Fetch dos pedidos do usuário e produtos relacionados
  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const userId = localStorage.getItem("user_id");
        const refreshtoken = localStorage.getItem("refresh_token");
        const pedidosData = await fetchAuthApi(`${import.meta.env.VITE_URL}/pedidos/${userId}/`, refreshtoken, navigate);
        setPedidos(pedidosData);

        // Extração de IDs dos produtos dos pedidos
        const produtosIds = new Set<number>();
        pedidosData.forEach((pedido: Pedido) => {
          pedido.itens.forEach((item: ItemPedido) => {
            produtosIds.add(item.produto);
          });
        });

        // Fetch de produtos relacionados aos pedidos
        const produtosData = await Promise.all(
          [...produtosIds].map(async (id: number) => {
            const produto = await fetchAuthApi(`${import.meta.env.VITE_URL}/produtos/${id}/`, refreshtoken, navigate);
            return produto;
          })
        );
        setProdutos(produtosData);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    };
    fetchPedidos();
  }, [navigate]);

  // Função para alternar a expansão dos detalhes de um pedido
  const toggleExpandir = (pedidoId: number) => {
    setExpandido(expandido === pedidoId ? null : pedidoId);
  };

  // Função para calcular o preço total de um pedido
  const calcularPrecoTotal = (pedido: Pedido) => {
    return pedido.itens.reduce((total, item) => {
      const produto = produtos.find((p) => p.id === item.produto);
      return total + (produto ? parseFloat(produto.preco) * item.quantidade : 0);
    }, 0);
  };

  return (
    <>
      <section>
        <div className="hero min-h-[calc(100vh-64px)] items-start bg-base-200">
          <div className="hero-content flex flex-col gap-4 w-full">
            <h1 className="text-5xl font-light pb-4 text-grey-600 hover:text-gray-300">Pedidos</h1>
            {/* Exibe mensagem caso o usuário não tenha pedidos */}
            {pedidos.length === 0 && (
              <div className="flex flex-col justify-center items-center">
                <h1 className="text-3xl font-light pb-4 text-grey-600 hover:text-gray-300">Você ainda não fez nenhuma compra.</h1>
              </div>
            )}
            <div className="w-full flex flex-col justify-center items-center">
              {/* Exibe os pedidos do usuário */}
              {pedidos.map((pedido) => (
                <React.Fragment key={pedido.id}>
                  <div
                    className="cursor-pointer flex flex-col justify-between items-center bg-base-100 rounded-lg shadow w-2/5 pb-3 duration-300 hover:bg-slate-800 mb-4 px-3"
                    onClick={() => toggleExpandir(pedido.id)}
                  >
                    <div className="flex justify-between items-center w-full">
                      <div className="flex flex-col my-1">
                        <h1 className="text-lg font-semibold text-grey-600 pt-1">Pedido #{pedido.id}</h1>
                        <div className={`flex ${expandido === pedido.id ? "flex-col" : ""}`}>
                          {/* Exibe os itens do pedido */}
                          {pedido.itens.map((item) => (
                            <React.Fragment key={item.produto}>
                              {expandido !== pedido.id && (
                                <>
                                  <div className="flex items-center justify-between ">
                                    <img
                                      src={produtos.find((produto) => produto.id === item.produto)?.imagem}
                                      className="w-20 h-20 my-2 mr-3 rounded-lg object-cover"
                                    />
                                  </div>
                                </>
                              )}
                              {expandido === pedido.id && (
                                <div className="">
                                  <a href={`produto/${item.produto}`}>
                                    <div className="hover:scale-105 duration-300 flex items-center">
                                      <img
                                        src={produtos.find((produto) => produto.id === item.produto)?.imagem}
                                        className="w-20 h-20 my-2 rounded-lg"
                                      />
                                      <div className="ml-2">
                                        <h1 className="text-sm text-grey-600 font-bold  max-w-[220px]">
                                          {produtos.find((produto) => produto.id === item.produto)?.nome}
                                        </h1>
                                        <p className="px-1 py-0.5 text-lg font-light text-grey-600 rounded-xl inline-block">
                                          R${item.preco}
                                        </p>
                                      </div>
                                    </div>
                                  </a>
                                </div>
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                      <span>{expandido === pedido.id ? "▲" : "▼"}</span>
                    </div>
                    <div className="flex flex-col w-full">
                      <div className=" justify-start items-center">
                        <p className="text-sm font-light text-gray-500 pt-1">
                          {pedido.itens.length} {pedido.itens.length === 1 ? "item" : "itens"}
                        </p>
                      </div>
                      <div className="flex justify-between items-center w-full">
                        <div className="flex items-center justify-center">
                          <div
                            className={`w-2 h-2 mr-1 rounded-full ${
                              pedido.status === "pendente" ? "bg-yellow-500" : "bg-green-300"
                            }`}
                          ></div>
                          <p className="text-sm font-light text-gray-600 pt-1">
                            {pedido.status.charAt(0).toUpperCase() + pedido.status.slice(1).toLowerCase()}
                          </p>
                        </div>
                        <div className="flex items-center justify-center">
                          <p className="text-sm font-light text-gray-500 mr-1">Preço total: </p>
                          <p> R${calcularPrecoTotal(pedido).toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
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

export default Pedidos;
