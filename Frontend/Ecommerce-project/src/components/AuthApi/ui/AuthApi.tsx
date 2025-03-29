import axios from "axios";

/**
 * Função que realiza uma requisição HTTP para a API com autenticação.
 * Se o token de acesso estiver expirado, tenta renovar o token de acesso utilizando o refresh token.
 * 
 */
const fetchAuthApi = async (url: string, refreshtoken: string | null, navigate: (path: string) => void) => {
  // Obtém o access token do localStorage
  const accesstoken = localStorage.getItem('access_token');
  
  // Verifica se o access token não está presente
  if (!accesstoken) {
    localStorage.clear();
    navigate('/');
    return null;
  }

  try {
    // Faz a requisição GET para a API com o token de acesso
    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accesstoken}`,
      },
    });
    return response.data;
  } catch (error: unknown) {
    // Se houver erro, verifica se o erro é relacionado a uma falha de autenticação (status 401)
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401 && refreshtoken) {
        try {
          // Tenta renovar o access token usando o refresh token
          const refreshResponse = await axios.post(`${import.meta.env.VITE_URL}/refresh/`, {
            refresh: refreshtoken
          }, {
            headers: {'Content-Type': 'application/json'},
          });

          // Atualiza o access token e o armazena no localStorage
          const newaccesstoken = refreshResponse.data.access;
          localStorage.setItem('access_token', newaccesstoken);
          axios.defaults.headers.common['Authorization'] = `Bearer ${newaccesstoken}`;

          // Tenta fazer a requisição novamente com o novo access token
          const retryResponse = await axios.get(`${import.meta.env.VITE_URL}/produtos`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${newaccesstoken}`,
            },
          });

          return retryResponse.data;
        } catch (refreshError) {
          // Se falhar ao renovar o token, limpa o localStorage e redireciona o usuário para a página de login
          localStorage.removeItem('access_token');
          console.error('refresh token invalido ou expirado', refreshError);
          localStorage.clear();
          navigate('/');
        }
      } else {
        console.error('Erro ao buscar produtos', error);
        localStorage.clear();
        navigate('/');
        return null;
      }
    } else {
      console.error('erro desconhecido', error);
      localStorage.clear();
      navigate('/');
      return null;
    }
  }
};

export default fetchAuthApi;
