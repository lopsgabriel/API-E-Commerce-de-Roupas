import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  /**
   * Efeito que é executado quando o componente é montado.
   * Remove os tokens de acesso e atualização do armazenamento local
   * e redireciona o usuário para a página inicial ("/").
   */
  useEffect(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    navigate("/");
  }, [navigate]);

  return null;
};

export default Logout;
