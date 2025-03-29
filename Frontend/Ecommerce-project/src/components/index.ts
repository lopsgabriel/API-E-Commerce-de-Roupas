import PrivateRoute from "./PrivateRoute/ui/PrivateRoute"; 
import fetchAuthApi from "./AuthApi/ui/AuthApi";
import ToggleWishlist from "./ToggleWishlist/ui/ToggleWishlist";
import CartUpdate from "./CartUpdate/ui/CartUpdate";
import { useSearch } from "./SearchContext/ui/useSearch";
import { SearchProvider } from "./SearchContext/ui/SearchContext";

/**
 * Exporta os componentes e hooks necessários para a aplicação.
 * 
 * - **PrivateRoute**: Componente para proteger rotas e garantir que o usuário esteja autenticado.
 * - **fetchAuthApi**: Função para fazer requisições autenticadas à API, lidando com tokens de acesso e refresh.
 * - **ToggleWishlist**: Função para adicionar ou remover produtos da lista de desejos.
 * - **CartUpdate**: Função para atualizar o carrinho de compras com base nas informações do usuário.
 * - **useSearch**: Hook para acessar o contexto de pesquisa da aplicação.
 * - **SearchProvider**: Provedor de contexto para gerenciar o estado da pesquisa em toda a aplicação.
 */
export { PrivateRoute, fetchAuthApi, ToggleWishlist, CartUpdate, useSearch, SearchProvider };
