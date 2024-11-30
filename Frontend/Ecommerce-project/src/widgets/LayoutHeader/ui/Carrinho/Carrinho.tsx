// ao clicar no icone do carrinho, o programa deve mostrar uma mini janela  com os itens do carrinho do usuario
import { fetchAuthApi } from "@/components";
import { useNavigate } from "react-router-dom";
import { FC, useEffect, useState } from "react";
import { TbShoppingCart } from "react-icons/tb";

interface ProdutosCarrinho {
  id: number;
  produto: string;
  preco: number;
  quantidade: number;
}

const Carrinho: FC = () => {
  const [produtos_carrinho, setProdutos_carrinho] = useState<ProdutosCarrinho[]>([]);
  const navigate = useNavigate()
  useEffect(() => {
    const fetchProdutosCarrinho = async () => {
      try {
        const userId = localStorage.getItem("user_id");
        const refreshtoken = localStorage.getItem("refresh_token");
        const produtosData = await fetchAuthApi(`${import.meta.env.VITE_URL}/carrinhos/perfil/${userId}`, refreshtoken, navigate);
        console.log(produtosData);
        setProdutos_carrinho(produtosData);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }


      }
    fetchProdutosCarrinho();
  }, [navigate]);
  
  return (
    <>
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn-ghost btn-circle btn">
            <TbShoppingCart />
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu rounded-box menu-sm right-0 mt-3 w-80 bg-base-100 p-2 shadow z-10 "
          >
            {produtos_carrinho.length === 0 ? (
              <li>
                <p>Seu carrinho esta vazio </p>
              </li>
            ) : (
              produtos_carrinho.map((carrinho) => (
                <>
                  <li key={carrinho.id}>
                    {/* quero criar um divisor entre os produtos */}
                    <div className="divider"></div>
                    <div className="flex items-center space-x-4">
                      <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12">
                          <img src="/logo-White.svg" alt="Avatar Tailwind CSS Component" />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">{carrinho.produto}</div>
                        <div className="text-sm opacity-50">Preço: R${carrinho.preco}</div>
                        <div className="text-sm opacity-50">Quantidade: {carrinho.quantidade}</div>
                      </div>
                    </div>
                  </li>
                </>
              ))
            )} 
            <div className="divider" />
            <div className="flex items-center space-x-4 pb-4 justify-center">
              <div>
                <div className="font-bold">Total:</div>
                <div className="text-sm opacity-50">Preço: R${produtos_carrinho.reduce((total, carrinho) => total + carrinho.preco * carrinho.quantidade, 0)}</div>
                <div className="text-sm opacity-50">Itens: {produtos_carrinho.reduce((total, carrinho) => total + carrinho.quantidade, 0)}</div>
              </div>
            </div>
            <a href="/cart" className="flex justify-center items-center btn btn-primary">Ver Carrinho</a>
        </ul>
        </div>
      </div>
    </>
  );
};

export default Carrinho;
