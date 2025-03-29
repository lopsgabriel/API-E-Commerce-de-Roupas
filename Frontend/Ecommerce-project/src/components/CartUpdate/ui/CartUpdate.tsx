import { fetchAuthApi } from "@/components";
import { useNavigate } from "react-router-dom";

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
 * Hook para atualizar os produtos do carrinho de um usuário.
 * 
 * Este hook busca os produtos no carrinho do usuário, atualiza as informações dos produtos com base nas quantidades no carrinho e retorna a lista atualizada de produtos.
 * 
 */
const CartUpdate = () => {
  const navigate = useNavigate();

  /**
   * Função assíncrona para atualizar os produtos do carrinho de um usuário.
   * 
   * Faz uma requisição à API para obter os produtos do carrinho e, em seguida, atualiza os dados de cada produto com base nas quantidades associadas no carrinho.
   * 
   */
  const atualizarCarrinho = async (): Promise<Carrinho[]> => {
    try {
      // Obtém o ID do usuário e o refresh token do localStorage
      const userId = localStorage.getItem("user_id");
      const refreshtoken = localStorage.getItem("refresh_token");

      // Obtém os dados dos produtos no carrinho para o usuário
      const produtosData = await fetchAuthApi(`${import.meta.env.VITE_URL}/carrinhos/${userId}/`, refreshtoken, navigate);

      // Mapeia os produtos no carrinho e os atualiza com base nas quantidades
      const listaProdutos = await Promise.all(
        produtosData.map(async (carrinho: ProdutosCarrinho) => {
          // Faz a requisição para obter os dados do produto
          const produto = await fetchAuthApi(`${import.meta.env.VITE_URL}/produtos/${carrinho.produto}/`, refreshtoken, navigate);
          // Atualiza a quantidade do produto conforme o carrinho
          produto.quantidade = carrinho.quantidade;
          return produto;
        })
      );

      // Retorna a lista de produtos atualizada
      return listaProdutos;
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      return []; // Retorna uma lista vazia em caso de erro
    }
  };

  return { atualizarCarrinho };
};

export default CartUpdate;
