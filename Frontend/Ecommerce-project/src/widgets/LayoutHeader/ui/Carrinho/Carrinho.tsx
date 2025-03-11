import { fetchAuthApi, CartUpdate } from "@/components";
import { useNavigate } from "react-router-dom";
import { FC, useEffect, useState } from "react";
import { TbShoppingCart } from "react-icons/tb";

interface ProdutosCarrinho {
  id: number;
  usuario: number;
  usuario_nome: string;
  produto: number;
  produto_nome: string;
  quantidade: number;
}

interface Carrinho {
  id: number;
  nome: string;
  descricao: string;
  preco: string;
  estoque: number;
  categoria: string;
  imagem: string;
  quantidade: number;
}

const Carrinho: FC = () => {
  const { atualizarCarrinho } = CartUpdate(); 
  const [produtos_carrinho, setProdutos_carrinho] = useState<Carrinho[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProdutosCarrinho = async () => {
      try {
        const userId = localStorage.getItem("user_id");
        const refreshtoken = localStorage.getItem("refresh_token");
        const produtosData = await fetchAuthApi(`${import.meta.env.VITE_URL}/carrinhos/${userId}/`, refreshtoken, navigate);

        const listaProdutos = await Promise.all(
          produtosData.map(async (carrinho: ProdutosCarrinho) => {
            const produto = await fetchAuthApi(`${import.meta.env.VITE_URL}/produtos/${carrinho.produto}/`, refreshtoken, navigate);
            produto.quantidade = carrinho.quantidade;
            return produto
          })
        ) 
        setProdutos_carrinho(listaProdutos);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    };
    fetchProdutosCarrinho();
  }, [navigate, ]);

  async function atualizar_Carrinho() {
    const produtosAtualizados = await atualizarCarrinho(); // Obtém os produtos atualizados
    setProdutos_carrinho(produtosAtualizados); // Atualiza o estado local diretamente
  }

  return (
    <>
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn-ghost btn-circle btn" onClick={atualizar_Carrinho}>
            <TbShoppingCart />
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu rounded-box menu-sm right-0 mt-3 w-80 bg-base-100 p-2 shadow z-10"
          >
            {produtos_carrinho.length === 0 ? (
              <li>
                <p className="text-center justify-center">Seu carrinho está vazio</p>
              </li>
            ) : (
              // chamar função atualizar carrinho
              produtos_carrinho.map((produto) => (
                <li key={produto.id} >
                  <div className="divider"></div>
                  <a href={`/dashboard/produto/${produto.id}`}>
                    <div className="flex items-center space-x-4">
                      <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12">
                          <img src={produto.imagem} alt="Avatar Tailwind CSS Component" />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">{produto.nome}</div>
                        <div className="text-sm opacity-50">Preço: R${Number(produto.preco) * produto.quantidade}</div>
                        <div className="text-sm opacity-50">Quantidade: {produto.quantidade}</div>
                      </div>
                    </div>
                  </a>
                </li>
              ))
            )}
            <div className="divider" />
            <a href="/cart" className="flex justify-center items-center btn btn-primary">
              Ver Carrinho
            </a>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Carrinho;
