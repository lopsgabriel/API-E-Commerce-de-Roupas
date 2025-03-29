import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Corrigido import de jwtDecode

interface Usuario {
  username: string;
  password: string;
}

const Login = () => {
  const [form, setForm] = useState<Usuario>({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  /**
   * Efeito responsável por verificar se o usuário já está autenticado.
   * Caso o token de acesso esteja presente no armazenamento local, o usuário é redirecionado para a página de dashboard.
   */
  useEffect(() => {
    if (localStorage.getItem("access_token")) {
      navigate("/dashboard");
    }
  }, [navigate]);

  /**
   * Função que atualiza o estado do formulário sempre que o usuário digita nos campos.
   * O valor dos campos de entrada (username e password) é armazenado no estado.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  /**
   * Função responsável por enviar as credenciais de login para a API e realizar o processo de autenticação.
   * Se a autenticação for bem-sucedida, os tokens de acesso e atualização, juntamente com as informações do usuário, são salvos no armazenamento local.
   * Caso contrário, exibe uma mensagem de erro.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Previne o comportamento padrão do formulário de recarregar a página
    try {
      const response = await axios.post(`${import.meta.env.VITE_URL}/login/`, form, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      localStorage.clear();
      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);

      const decoded = jwtDecode(response.data.access) as { user_id: string };
      localStorage.setItem("user_id", decoded.user_id);

      const user = await axios.get(`${import.meta.env.VITE_URL}/perfis/?usuario_id=${decoded.user_id}`, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${response.data.access}` },
      })
      const [userData] = user.data
      console.log(userData)
      localStorage.setItem("username", userData.usuario);
      localStorage.setItem("user_id", userData.id);
      localStorage.setItem("admin", userData.admin);

      axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.access}`;
      navigate("/dashboard");
    } catch (err) {
      setError("Credenciais inválidas");
      console.error(err);
    }
  };

  return (
    <section>
      <div className="pt-40 min-h-[calc(100vh-64px)] bg-base-200">
        <div className="login-form flex flex-col justify-center items-center">
          <form onSubmit={handleSubmit} className="flex flex-col items-center bg-base-100 p-8 rounded-xl shadow-lg w-full max-w-lg mb-4">
            <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-base-200 rounded-lg my-2"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-base-200 rounded-lg my-2"
            />
            <button
              type="submit"
              className="bg-green-600 px-4 my-2 py-1 rounded-lg text-lg text-white w-full font-semibold hover:bg-green-700 duration-300"
            >
              Login
            </button>
          <p>
            Don't have an account?{" "}
            <a href="/signup" className="text-cyan-600 font-bold hover:underline">
              Sign Up
            </a>
          </p>
          </form>
          {error && <p className="text-red-500 pt-2">{error}</p>}
        </div>
      </div>
    </section>
  );
};

export default Login;
