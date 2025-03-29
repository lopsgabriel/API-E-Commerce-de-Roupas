import { Navigate } from 'react-router-dom';

/**
 * Componente que protege rotas privadas, garantindo que apenas usuários autenticados possam acessá-las.
 * 
 * Este componente verifica se o usuário está autenticado com base na presença de um token de acesso (`access_token`) no `localStorage`.
 * Se o usuário não estiver autenticado, ele será redirecionado para a página de login.
 * Caso contrário, o conteúdo da rota privada será renderizado.
 * 
 */
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  // Verifica se o usuário tem o token de acesso no localStorage
  const isAuthenticated = !!localStorage.getItem('access_token');

  if (!isAuthenticated) {
    // Se não estiver autenticado, redireciona para a página de login
    return <Navigate to="/" />;
  }

  // Se estiver autenticado, renderiza o conteúdo da rota privada
  return children;
};

export default PrivateRoute;
