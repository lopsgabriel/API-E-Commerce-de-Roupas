import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const GitHubCallbackHandler = () => {
  const navigate = useNavigate();

  const handleGitHubCallback = useCallback(async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code'); // O código que o GitHub retorna no callback

    try {
      // Envia o código para o backend para obter os tokens
      const response = await axios.post(`${import.meta.env.VITE_URL}/github/callback/`, {
        code,
      });

      // Armazena os tokens no localStorage
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);

      // Use the navigate hook here
      navigate('/dashboard');
    } catch (error) {
      console.error('Erro no login com GitHub', error);
    }
  }, [navigate]);

  useEffect(() => {
    handleGitHubCallback();
  }, [handleGitHubCallback]);

  return <div />;
};

export default GitHubCallbackHandler;