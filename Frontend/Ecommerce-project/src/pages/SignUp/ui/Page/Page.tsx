import { FC, useState, ChangeEvent, FormEvent } from "react";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

interface Usuario {
  username: string;
  email: string;
  password: string;
}

const SignUp: FC = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState<Usuario>({
    username: "",
    email: "",
    password: "",
  });

  const CriarUsuario = async (usuario: Usuario) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_URL}register/`, usuario, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("Usuário criado com sucesso:", response.data);
      navigate("/");
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Erro na resposta:", error.response?.data);
        console.error("Código de status:", error.response?.status);
      } else {
        console.error("Erro ao criar o usuário:", error);
      }
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUsuario({ ...usuario, [name]: value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await CriarUsuario(usuario);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200 py-3">
      <form onSubmit={handleSubmit} className="bg-base-100 p-8 rounded-xl shadow-lg w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
        <div className="mb-4">
          <input
          type="text"
          id="username"
          name="username"
          placeholder="Username"
          value={usuario.username}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-base-200 rounded-lg"
          required
        />
        </div>
        <div className="mb-4">
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            value={usuario.email}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-base-200 rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            value={usuario.password}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-base-200 rounded-lg"
            required
          />
        </div>
        <button type="submit" className="w-full py-2 px-4 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 duration-300">
          Sign Up
        </button>
        <p className="mt-4 text-center">Do you have an account? <a href="/" className="text-blue-500 font-semibold hover:underline">Login</a></p>
      </form>
    </div>
  );
};

export default SignUp;
