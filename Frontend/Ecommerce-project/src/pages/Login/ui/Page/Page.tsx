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

  useEffect(() => {
    if (localStorage.getItem("access_token")) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

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

      axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.access}`;
      navigate("/dashboard");
    } catch (err) {
      setError("Credenciais inválidas");
      console.error(err);
    }
  };

  const getGithubAccessToken = async () => {
    const response = await fetch('http://localhost:8000/api/github/token/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('your_auth_token')}`,
      },
    });

    const data = await response.json();

    if (data.access_token){
      console.log('Access Token do GitHub:', data.access_token);
      localStorage.setItem('github_access_token', data.access_token); 
    } else {
      console.error('Erro ao obter o token:', data.error)
    }
  }


  const handleGitHubLogin = async () => {
    const url = 'https://github.com/login/oauth/authorize?client_id=Ov23liQ703ig8p0VaRBt&redirect_uri=http://localhost:8000/accounts/github/login/callback/&scope=repo,user'; // URL do seu backend para iniciar o login com GitHub
  
    // Redireciona para o backend para iniciar o login via GitHub
    window.location.href = url;
  };

  return (
    <section>
      <div className="pt-60 min-h-[calc(100vh-64px)] bg-base-200">
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
            <button onClick={handleGitHubLogin}>
              Github
            </button>

            <button onClick={getGithubAccessToken}>
              AAAAAAAAAAAAAAA
            </button>
          </form>
          {error && <p className="text-red-500 pt-2">{error}</p>}
        </div>
      </div>
    </section>
  );
};

export default Login;
