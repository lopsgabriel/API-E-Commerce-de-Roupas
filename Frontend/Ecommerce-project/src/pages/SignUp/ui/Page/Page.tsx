import { FC, useState, ChangeEvent, FormEvent } from "react";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { Logo } from "@/widgets";

// Definição da interface Usuario que descreve os dados do usuário no formulário de registro
interface Usuario {
  username: string;  // Nome de usuário
  email: string;     // Endereço de e-mail
  password: string;  // Senha do usuário
}

// Componente de função para registro de um usuário
const SignUp: FC = () => {
  // Hook do React Router para navegação
  const navigate = useNavigate();

  // Estado para armazenar os dados do usuário no formulário de registro
  const [usuario, setUsuario] = useState<Usuario>({
    username: "",  // Inicializa com valores vazios
    email: "",
    password: "",
  });

  // Função para criar um novo usuário no backend
  const CriarUsuario = async (usuario: Usuario) => {
    try {
      // Envia uma solicitação POST para criar o usuário no backend
      const response = await axios.post(`${import.meta.env.VITE_URL}register/`, usuario, {
        headers: { "Content-Type": "application/json" },  // Cabeçalho indicando tipo JSON
      });
      console.log("Usuário criado com sucesso:", response.data);  // Sucesso
      navigate("/");  // Redireciona para a página inicial após o sucesso
    } catch (error) {
      // Trata possíveis erros ao fazer a requisição
      if (error instanceof AxiosError) {
        console.error("Erro na resposta:", error.response?.data);  // Exibe erro de resposta
        console.error("Código de status:", error.response?.status);  // Exibe código de status
      } else {
        console.error("Erro ao criar o usuário:", error);  // Outros tipos de erro
      }
    }
  };

  // Função para manipular mudanças nos campos de input
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;  // Obtém o nome e valor do input alterado
    setUsuario({ ...usuario, [name]: value });  // Atualiza o estado do usuário com o novo valor
  };

  // Função para lidar com o envio do formulário de registro
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();  // Impede o comportamento padrão do formulário (recarregar a página)
    await CriarUsuario(usuario);  // Chama a função para criar o usuário
  };

  // JSX retornado pelo componente
  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200 py-3">
      <form onSubmit={handleSubmit} className="bg-base-100 p-8 rounded-xl shadow-lg w-full max-w-lg">
        <div className='flex justify-center mb-2'>
          <Logo logoName={"E-Loja"} />
        </div>
        <h1 className="text-2xl font-bold mb-6 text-center">Crie sua conta</h1>
        <div className="mb-4">
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Usuário"
            value={usuario.username}  // Valor controlado do campo
            onChange={handleChange}  // Atualiza o estado ao digitar
            className="w-full px-4 py-2 bg-base-200 rounded-lg"
            required  // Torna o campo obrigatório
          />
        </div>
        <div className="mb-4">
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            value={usuario.email}  // Valor controlado do campo
            onChange={handleChange}  // Atualiza o estado ao digitar
            className="w-full px-4 py-2 bg-base-200 rounded-lg"
            required  // Torna o campo obrigatório
          />
        </div>
        <div className="mb-4">
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Senha"
            value={usuario.password}  // Valor controlado do campo
            onChange={handleChange}  // Atualiza o estado ao digitar
            className="w-full px-4 py-2 bg-base-200 rounded-lg"
            required  // Torna o campo obrigatório
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 duration-300"
        >
          Criar conta
        </button>
        <p className="mt-4 text-center">
          Já tem uma conta?{" "}
          <a href="/" className="text-green-500 font-semibold hover:underline">
            Entrar
          </a>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
