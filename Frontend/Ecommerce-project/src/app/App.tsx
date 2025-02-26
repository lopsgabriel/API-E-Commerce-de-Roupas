import { FC } from "react";
import { Route, Routes } from "react-router-dom";
import { Layout } from "@/app/Layout";
import { Home, NoMatch, Adicionar, Produto, Login, Logout, Cart, Categoria, SignUp, Favoritos } from "@/pages";
import { PrivateRoute } from "@/components";

const App: FC = () => {
  return (
    <>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={ <Login /> } />
        <Route path="signup" element={ <SignUp /> } />
        <Route path="dashboard" element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />

        <Route path="adicionar" element={
            <PrivateRoute>
              <Adicionar />
            </PrivateRoute>
          }
        />

        <Route path="/dashboard/produto/:id_produto" element={
            <PrivateRoute>
              <Produto />
            </PrivateRoute>
          }
        />

        <Route path="logout" element={
            <PrivateRoute>
              <Logout />
            </PrivateRoute>
          }
        />

        <Route path="cart" element={
          <PrivateRoute>
            <Cart />
          </PrivateRoute>
          }
        />

        <Route path="favoritos" element={
          <PrivateRoute>
            <Favoritos />
          </PrivateRoute>
          }
        />

        <Route path="categoria/:categoria" element={
          <PrivateRoute>
            <Categoria />
          </PrivateRoute>
        }
        />
        {/* Rota para páginas não encontradas */}
        <Route path="*" element={<NoMatch />} />
      </Route>
    </Routes>
    </>
  );
};

export default App;
