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

const CartUpdate = () => {
  const navigate = useNavigate();

  const atualizarCarrinho = async (): Promise<Carrinho[]> => {
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
      return listaProdutos; // Retorna os produtos SEM atualizar um estado interno
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      return [];
    }
  };

  return { atualizarCarrinho };
};

export default CartUpdate;

