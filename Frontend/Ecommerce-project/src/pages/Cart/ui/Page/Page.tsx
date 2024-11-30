import { fetchAuthApi } from "@/components";
import { useNavigate } from "react-router-dom";
import { FC, useEffect, useState } from "react";

interface ProdutosCarrinho {
  id: number;
  produto: string;
  preco: number;
  quantidade: number;
}

const Cart: FC = () => {
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
        <div className="hero min-h-[calc(100vh-64px)] bg-base-200">
          <div className="w-full flex justify-center">
            <div className="items-center justify-center h-full w-10/12 px-4 bg-base-100 rounded-lg">
              <div className="flex flex-col items-center border-b-2 border-gray-200 border-opacity-30 py-2">
                <div className="grid grid-cols-4 w-full max-w-5xl py-2 ">
                  <p className="font-medium text-center">Produtos</p>
                  <p className="font-medium text-center">Quantidade</p>
                  <p className="font-medium text-center">Valor Unitário</p>
                  <p className="font-medium text-center">Valor Total</p>
                </div>
                {produtos_carrinho.length === 0 ? (
                  <li>
                  <p>Seu carrinho esta vazio </p>
                  </li>
                ) : (
                  produtos_carrinho.map((carrinho) => (
                    <div key={carrinho.id} className="grid grid-cols-4 w-full max-w-5xl items-center">
                      <div className="flex items-center">
                        <div className="avatar">
                            <div className="mask mask-squircle w-12 h-12">
                                <img src="/logo-White.svg" alt="Avatar Tailwind CSS Component" />
                            </div>
                        </div>
                        <p className="truncate ml-2">{carrinho.produto}</p>
                      </div>
                          <div className="text-base font-thin text-center"> {carrinho.quantidade}</div>
                          <div className="text-base font-thin text-center"> R${carrinho.preco}</div>
                          <div className="text-base font-semibold text-center"> R${carrinho.preco * carrinho.quantidade}</div>
                    </div>
                  ))
                )}
              </div>
                <div className="flex items-center space-x-4 pb-4 justify-center py-4">
                  <div className="flex flex-col w-1/5">
                    <p className="font-bold">Resumo:</p>
                    <div className="flex justify-between py-1 " style={{ borderBottom: '1px solid #C8C8C810' }}>
                      <p className="text-base font-thin">Valor dos produtos: </p> 
                      <p className="text-base font-thin">R${produtos_carrinho.reduce((total, carrinho) => total + carrinho.preco * carrinho.quantidade, 0)}</p>
                    </div>
                    <div className="flex justify-between py-1 " style={{ borderBottom: '1px solid #C8C8C810' }}>
                      <p className="text-base font-thin">Frete:</p>
                      <p className="text-base font-thin">A calcular</p>
                    </div>
                    <div className="flex justify-between py-1 " style={{ borderBottom: '1px solid #C8C8C810' }}>
                      <p className="text-base font-thin">Itens:</p>
                      <p className="text-base font-thin">{produtos_carrinho.reduce((total, carrinho) => total + carrinho.quantidade, 0)}</p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center pb-5">
                  <button className="btn btn-primary">Continuar compra</button>
                </div>
            </div>
          </div>
        </div>
      </>
    )
}

export default Cart