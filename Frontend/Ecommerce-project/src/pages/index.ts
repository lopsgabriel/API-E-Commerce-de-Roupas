/**
 * Componente de exportação centralizada de todos os componentes do aplicativo.
 * Este arquivo agrupa os componentes para facilitar a importação em outras partes do projeto.
 */
import { Home } from "./Home"; // Componente da página inicial
import { NoMatch } from "./NoMatch"; // Componente exibido quando uma rota não é encontrada (página 404)
import { Adicionar } from "./Adicionar"; // Componente para adicionar um novo item (produto)
import { Produto } from "./produto"; // Componente para exibir detalhes de um produto
import { Login } from "./Login"; // Componente de login de usuário
import { Logout } from "./Logout"; // Componente para deslogar o usuário
import { Cart } from "./Cart" // Componente do carrinho de compras
import { Categoria } from "./Categoria"; // Componente para gerenciar ou exibir categorias de produtos
import { SignUp } from "./SignUp"; // Componente para cadastro de novos usuários
import { Favoritos } from "./Favoritos"; // Componente que exibe os produtos favoritos do usuário
import { Pedidos } from "./Pedidos"; // Componente para gerenciar e exibir pedidos
import { EditProduct } from "./EditProduct"; // Componente para editar um produto existente

/**
 * Exporta todos os componentes importados para facilitar a importação em outros arquivos.
 * Isso centraliza as exportações e mantém o código mais organizado.
 */
export { Home, NoMatch, Adicionar, Produto, Login, Logout, Cart, Categoria, SignUp, Favoritos, Pedidos, EditProduct };
