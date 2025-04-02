import { fetchAuthApi, CartUpdate } from "@/components";
import { useNavigate } from "react-router-dom";
import { FC, useEffect, useState } from "react";
import { TbShoppingCart } from "react-icons/tb";

/**
 * Interface `ProdutosCarrinho` define os dados dos itens no carrinho do usuário.
 * Ela inclui informações sobre o produto, a quantidade e o usuário que adicionou o item ao carrinho.
 */
interface ProdutosCarrinho {
  id: number;
  usuario: number;
  usuario_nome: string;
  produto: number;
  produto_nome: string;
  quantidade: number;
}

/**
 * Interface `Carrinho` define a estrutura dos produtos no carrinho, incluindo o nome, descrição,
 * preço, estoque, categoria, imagem e quantidade.
 */
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
 * Componente `Carrinho` exibe o ícone de carrinho de compras com a lista de produtos 
 * no carrinho do usuário. O componente permite a atualização dinâmica do conteúdo do carrinho,
 * recuperando dados da API e atualizando o estado com as informações mais recentes.
 * 
 * A lógica de atualização do carrinho é implementada através do hook `useEffect` para buscar
 * os produtos do carrinho do usuário, e o hook `CartUpdate` para atualizar a lista de produtos 
 * no estado local. Os produtos exibidos incluem o nome, preço e quantidade.
 * 
 * O carrinho é exibido em um menu dropdown que se expande quando o usuário clica no ícone
 * do carrinho. Se o carrinho estiver vazio, uma mensagem é exibida. Caso contrário, os produtos
 * do carrinho são listados, permitindo ao usuário acessar mais informações sobre cada item.
 */
const Carrinho: FC = () => {
  const { atualizarCarrinho } = CartUpdate(); // Função para atualizar o carrinho
  const [produtos_carrinho, setProdutos_carrinho] = useState<Carrinho[]>([]); // Estado para armazenar os produtos no carrinho
  const navigate = useNavigate(); // Hook para navegação

  // Efeito que busca os produtos do carrinho do usuário ao carregar o componente
  useEffect(() => {
    const fetchProdutosCarrinho = async () => {
      try {
        const userId = localStorage.getItem("user_id"); // Obtém o ID do usuário do localStorage
        const refreshtoken = localStorage.getItem("refresh_token"); // Obtém o refresh token
        const produtosData = await fetchAuthApi(`${import.meta.env.VITE_URL}/carrinhos/${userId}/`, refreshtoken, navigate); // Busca os dados do carrinho

        // Mapeia os dados do carrinho para buscar informações detalhadas de cada produto
        const listaProdutos = await Promise.all(
          produtosData.map(async (carrinho: ProdutosCarrinho) => {
            const produto = await fetchAuthApi(`${import.meta.env.VITE_URL}/produtos/${carrinho.produto}/`, refreshtoken, navigate); // Busca o produto específico
            produto.quantidade = carrinho.quantidade; // Adiciona a quantidade do produto no carrinho
            return produto;
          })
        );
        setProdutos_carrinho(listaProdutos); // Atualiza o estado com a lista de produtos
      } catch (error) {
        console.error("Erro ao buscar produtos:", error); // Exibe erro caso falhe ao buscar os produtos
      }
    };
    fetchProdutosCarrinho();
  }, [navigate]); // O efeito é reexecutado quando o hook `navigate` é alterado

  /**
   * Função que atualiza a lista de produtos do carrinho.
   * Chama a função `atualizarCarrinho` e atualiza o estado com os produtos mais recentes.
   */
  async function atualizar_Carrinho() {
    const produtosAtualizados = await atualizarCarrinho(); // Obtém os produtos atualizados
    setProdutos_carrinho(produtosAtualizados); // Atualiza o estado local com os produtos atualizados
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
              // Exibe os produtos do carrinho
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
                        <div className="font-bold">
                          {produto.nome.length > 20 ? produto.nome.slice(0, 20).concat("...") : produto.nome}
                        </div>
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
