import axios from "axios";

const fetchAuthApi = async (url: string, refreshtoken: string | null, navigate: (path: string) => void) => {
  const accesstoken = localStorage.getItem('access_token');
  
  if (!accesstoken) {
    navigate('/');
    return null;
  }

  try {
    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accesstoken}`,
      },
    });
    return response.data;
} catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401 && refreshtoken) {
        try{
          const refreshResponse = await axios.post(`${import.meta.env.VITE_URL}/refresh/`, {
            refresh: refreshtoken
          }, {
            headers: {'Content-Type': 'application/json'},
          });
          const newaccesstoken = refreshResponse.data.access
          localStorage.setItem('access_token', newaccesstoken)
          axios.defaults.headers.common['Authorization'] = `Bearer ${newaccesstoken}`;

          const retryResponse = await axios.get(`${import.meta.env.VITE_URL}/produtos`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${newaccesstoken}`,
            },
          });

          return retryResponse.data
        } catch (refreshError) {
          localStorage.removeItem('access_token')
          console.error('refresh token invalido ou expirado', refreshError)
          navigate('/')
        }
      } else {
        console.error('Erro ao buscar produtos', error)
        navigate('/')
        return null
      }
    } else {
      console.error('erro desconhecido', error)
      navigate('/')
      return null
    }
  }
};

export default fetchAuthApi
