import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    
  const isAuthenticated = !!localStorage.getItem('access_token'); // Verifica se o usuário tem o token no localStorage

  if (!isAuthenticated) {
    // Se não estiver autenticado, redireciona para a página de login

    return <Navigate to="/" />;
  }

  return children; // Se estiver autenticado, renderiza o conteúdo
};

export default PrivateRoute;
