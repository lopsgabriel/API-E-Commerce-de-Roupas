import { fetchAuthApi } from "@/components";
import { useNavigate } from "react-router-dom";
import { FC, useEffect, useState } from "react";
import { TbTrashFilled } from "react-icons/tb";
import axios from "axios";

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

/**
 * Componente que gerencia o carrinho de compras do usuário.
 * Este componente busca os produtos no carrinho do usuário, 
 * exibe os itens, permite a exclusão de produtos e a finalização da compra.
 */
const Cart: FC = () => {
    const [produtos_carrinho, setProdutos_carrinho] = useState<Carrinho[]>([]);
    const navigate = useNavigate();
    const user_id = localStorage.getItem("user_id");

    /**
     * Função que busca os produtos no carrinho do usuário e os dados dos produtos.
     * A função faz uma requisição à API para obter os itens do carrinho e as informações detalhadas dos produtos.
     * Atualiza o estado dos produtos do carrinho com os dados recebidos.
     */
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
              return produto;
            })
          );
          setProdutos_carrinho(listaProdutos);
        } catch (error) {
          console.error("Erro ao buscar produtos:", error);
        }
      };
      fetchProdutosCarrinho();
    }, [navigate]);

    /**
     * Função que remove um produto do carrinho.
     * Faz uma requisição DELETE para remover o produto do carrinho do usuário.
     * Após a remoção, atualiza o estado dos produtos do carrinho.
     * 
     * @param id - Identificador do produto a ser removido do carrinho.
     */
    const deleteProduct = async (id: number) => {
      const refresh_token = localStorage.getItem('access_token');
      await axios.delete(`${import.meta.env.VITE_URL}carrinhos/${user_id}/${id}/`, { 
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${refresh_token}` } 
      }); 
      setProdutos_carrinho([]);
    };

    /**
     * Função que cria um pedido com os produtos no carrinho.
     * Envia uma requisição POST para a criação do pedido, passando os produtos e suas quantidades.
     * 
     * @returns Retorna os dados do pedido criado.
     */
    const createPedido = async () => {
      const refresh_token = localStorage.getItem('access_token');
      const body = {
        usuario: user_id,
        itens: produtos_carrinho.map((produto) => ({ 
          produto: produto.id, 
          quantidade: produto.quantidade 
        }))
      };

      const pedido = await axios.post(`${import.meta.env.VITE_URL}pedidos/${user_id}/`, body, {
        headers: { 
          'Content-Type': 'application/json', 
          Authorization: `Bearer ${refresh_token}` 
        }
      });
      return pedido.data;
    };

    /**
     * Função que processa o checkout, atualizando o estoque dos produtos e criando o pedido.
     * Para cada produto no carrinho, atualiza o estoque na API e, após isso, cria o pedido.
     * Após a criação do pedido, os produtos são removidos do carrinho.
     */
    const checkout = async () => {
      const refresh_token = localStorage.getItem('access_token');
    
      try {
        // Atualizar o estoque de todos os produtos primeiro
        await Promise.all(produtos_carrinho.map(async (produto) => {
          await axios.put(`${import.meta.env.VITE_URL}/produto/${produto.id}`, {
            nome: produto.nome,
            preco: produto.preco,
            estoque: produto.estoque - produto.quantidade,
            categoria: produto.categoria
          }, {
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${refresh_token}` }
          });
    
          console.log(`o novo estoque de ${produto.nome} é ${produto.estoque - produto.quantidade}`);
        }));
    
        // Criar o pedido após todos os produtos serem atualizados
        await createPedido();
    
        // Se deu certo, deletar os produtos do carrinho
        produtos_carrinho.forEach(produto => deleteProduct(produto.id));
    
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Erro no processo de checkout:', error.response?.data);
        } else {
          console.error('Erro inesperado:', error);
        }
      }
    };

    return (
      <div className="hero min-h-[calc(100vh-64px)] bg-base-200">
        <div className="w-full flex justify-center m-10">
          <div className="items-center justify-center h-full w-8/12 px-4 bg-base-100 rounded-lg">
            <div className="flex flex-col items-center border-b-2 border-gray-200 border-opacity-30 p-4">
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
                    <div className="text-base font-thin text-center">{carrinho.quantidade}</div>
                    <div className="text-base font-thin text-center">R${carrinho.preco}</div>
                    <div className="text-base font-semibold text-center flex justify-center">
                      <p>R${(parseFloat(carrinho.preco) * carrinho.quantidade).toFixed(2)}</p>
                      <button className="ml-2 text-red-500 hover:text-red-600 hover:text-xl duration-200"
                        onClick={() => deleteProduct(carrinho.id)}>
                        <TbTrashFilled />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="flex items-center space-x-4 pb-4 justify-center py-4">
              <div className="flex flex-col w-2/5">
                <p className="font-bold">Resumo:</p>
                <div className="flex justify-between py-1" style={{ borderBottom: '1px solid #C8C8C810' }}>
                  <p className="text-base font-thin">Valor dos produtos: </p> 
                  <p className="text-base font-thin ">R${(produtos_carrinho.reduce((total, carrinho) => total + parseFloat(carrinho.preco) * carrinho.quantidade, 0)).toFixed(2)}</p>
                </div>
                <div className="flex justify-between py-1" style={{ borderBottom: '1px solid #C8C8C810' }}>
                  <p className="text-base font-thin">Frete:</p>
                  <p className="text-base font-thin">A calcular</p>
                </div>
                <div className="flex justify-between py-1" style={{ borderBottom: '1px solid #C8C8C810' }}>
                  <p className="text-base font-thin">Itens:</p>
                  <p className="text-base font-thin">{produtos_carrinho.reduce((total, carrinho) => total + carrinho.quantidade, 0)}</p>
                </div>
              </div>
            </div>
            <div className="flex justify-center pb-5">
              <button className="btn btn-primary" onClick={checkout}>Finalizar Compra</button>
            </div>
          </div>
        </div>
      </div>
    );
};

export default Cart;
