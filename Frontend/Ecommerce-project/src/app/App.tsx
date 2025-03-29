import { FC } from "react";
import { Route, Routes } from "react-router-dom";
import { Layout } from "@/app/Layout";
import { Home, NoMatch, Adicionar, Produto, Login, Logout, Cart, Categoria, SignUp, Favoritos, Pedidos, EditProduct } from "@/pages";
import { PrivateRoute, SearchProvider } from "@/components";

/**
 * Componente principal da aplicação que gerencia as rotas da aplicação.
 * Envolve o layout da aplicação e define as rotas para diferentes páginas e componentes.
 * Utiliza o `PrivateRoute` para proteger páginas que exigem autenticação.
 * Usa o `SearchProvider` para fornecer contexto de pesquisa em toda a aplicação.
 * 
 */
const App: FC = () => {
  return (
    <>
    <SearchProvider>
      <Routes>
        {/* Rota principal com layout */}
        <Route path="/" element={<Layout />}>
          {/* Rota de login */}
          <Route index element={ <Login /> } />
          {/* Rota de signup (criação de conta) */}
          <Route path="signup" element={ <SignUp /> } />

          {/* Rota para o dashboard, protegida por autenticação */}
          <Route path="dashboard" element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
          />

          {/* Rota para adicionar novo item ao sistema, protegida */}
          <Route path="adicionar" element={
            <PrivateRoute>
              <Adicionar />
            </PrivateRoute>
          }
          />

          {/* Rota para visualizar um produto específico, protegida */}
          <Route path="produto/:id_produto" element={
            <PrivateRoute>
              <Produto />
            </PrivateRoute>
          }
          />

          {/* Rota de logout, protegida */}
          <Route path="logout" element={
            <PrivateRoute>
              <Logout />
            </PrivateRoute>
          }
          />

          {/* Rota para visualização do carrinho, protegida */}
          <Route path="cart" element={
            <PrivateRoute>
              <Cart />
            </PrivateRoute>
          }
          />

          {/* Rota para visualizar os favoritos, protegida */}
          <Route path="favoritos" element={
            <PrivateRoute>
              <Favoritos />
            </PrivateRoute>
          }
          />

          {/* Rota para visualização de produtos por categoria, protegida */}
          <Route path="categoria/:categoria" element={
            <PrivateRoute>
              <Categoria />
            </PrivateRoute>
          }
          />

          {/* Rota para visualizar pedidos, protegida */}
          <Route path="pedidos" element={
            <PrivateRoute>
              <Pedidos />
            </PrivateRoute>
          }
          />

          {/* Rota para editar um produto, protegida */}
          <Route path="editar" element={
            <PrivateRoute>
              <EditProduct />
            </PrivateRoute>
          }
          />

          {/* Rota para página não encontrada */}
          <Route path="*" element={<NoMatch />} />
        </Route>
      </Routes>
    </SearchProvider>
    </>
  );
};

export default App;
