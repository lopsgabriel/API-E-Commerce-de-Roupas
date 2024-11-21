import { FC } from "react";
import { Route, Routes } from "react-router-dom";
import { Layout } from "@/app/Layout";
import { Home, NoMatch, Adicionar, Produto, Login } from "@/pages";
import { PrivateRoute } from "@/components";

const App: FC = () => {
  return (
    <>
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Rotas públicas */}
        <Route path="login" element={<Login />} />

        {/* Rotas privadas */}
        <Route
          index
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="dashboard"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="adicionar"
          element={
            <PrivateRoute>
              <Adicionar />
            </PrivateRoute>
          }
        />
        <Route
          path="produto/:id_produto"
          element={
            <PrivateRoute>
              <Produto />
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
