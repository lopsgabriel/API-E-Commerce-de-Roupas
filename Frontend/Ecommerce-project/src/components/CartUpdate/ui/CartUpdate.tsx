// Quero criar um componente capaz de atualizar o carrinho, no caso ele recebe os itensque estão guardados no carrinho
// e ai ele guarda em uma variavel, assim mandando para o header os itens atualizados
// essa função será chamada sempre que um item for adicionado no carro na pagina Home
// ou seja, o item vai ser adicionado, essa função vai ser chamada, e ai ela atualiza os itens do carrinho
// e ai ele vai mandar para o header os itens atualizados

import { fetchAuthApi } from "@/components";
import { useNavigate } from "react-router-dom";
// import { useState } from "react";

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

