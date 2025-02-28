import { fetchAuthApi } from "@/components";
import { useNavigate } from "react-router-dom";
import { FC, useEffect, useState } from "react";
import { TbTrashFilled } from "react-icons/tb";
import axios from "axios";

interface ProdutosCarrinho {
  id: number;
  perfil_carrinho: number;
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

const Cart: FC = () => {
    const [produtos_carrinho, setProdutos_carrinho] = useState<Carrinho[]>([]);
    const navigate = useNavigate()
    const user_id = localStorage.getItem("user_id");
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
    }, [navigate]);

    // const atualizarCarrinho = async () => {
    //   const userId = localStorage.getItem("user_id");
    //   const refreshtoken = localStorage.getItem("refresh_token");
    //   const carrinhoData = await fetchAuthApi(`${import.meta.env.VITE_URL}/carrinhos/${userId}/`, refreshtoken, navigate);
    //   setProdutos_carrinho(carrinhoData);
    // };
    
    const deleteProduct = async (id: number) => {
      const refresh_token = localStorage.getItem('access_token')
      await axios.delete(`${import.meta.env.VITE_URL}carrinhos/${user_id}/${id}/`, { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${refresh_token}` } }); 
      setProdutos_carrinho(produtos_carrinho.filter((produto) => produto.id !== id));

    };
    
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
                  <p>Seu carrinho esta vazio </p>
                ) : (
                  produtos_carrinho.map((carrinho) => (
                    <div key={carrinho.id} className="grid grid-cols-4 w-full max-w-5xl py-2 items-center">
                      <div className="flex items-center">
                        <div className="avatar">
                          <div className="mask mask-squircle w-12 h-12">
                            <img src={carrinho.imagem} alt="Avatar Tailwind CSS Component" />
                          </div>
                        </div>
                        <p className="truncate ml-2">{carrinho.nome}</p>
                      </div>
                          <div className="text-base font-thin text-center"> {carrinho.quantidade}</div>
                          <div className="text-base font-thin text-center"> R${carrinho.preco}</div>
                          <div className="text-base font-semibold text-center flex justify-between pl-28">
                            <p>
                            R${parseFloat(carrinho.preco) * carrinho.quantidade}
                            </p> 
                            <button className="text-red-500 hover:text-red-600 hover:text-xl duration-200"
                            onClick={() => deleteProduct(carrinho.id)}>
                            <TbTrashFilled />
                            </button>
                          </div>
                    </div>
                  ))
                )}
              </div>
                <div className="flex items-center space-x-4 pb-4 justify-center py-4">
                  <div className="flex flex-col w-1/5">
                    <p className="font-bold">Resumo:</p>
                    <div className="flex justify-between py-1 " style={{ borderBottom: '1px solid #C8C8C810' }}>
                      <p className="text-base font-thin">Valor dos produtos: </p> 
                      <p className="text-base font-thin">R${produtos_carrinho.reduce((total, carrinho) => total + parseFloat(carrinho.preco) * carrinho.quantidade, 0)}</p>
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