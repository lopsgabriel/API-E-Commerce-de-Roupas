import { FC, useEffect } from "react";
import { Logo } from "@/widgets";
import User from "../User/User";
import { useState } from "react";
import Carrinho from "../Carrinho/Carrinho";
import { useLocation } from 'react-router-dom';
import { useSearch } from "@/components";

/**
 * Componente `LayoutHeader` que exibe o cabeçalho da aplicação.
 * O cabeçalho inclui o logo, barra de pesquisa, links de navegação
 * condicionalmente baseados na autenticação do usuário e na localização atual da página.
 * Também é exibido um carrinho de compras e um menu de usuário, dependendo do estado de autenticação.
 * 
 * A lógica de exibição de conteúdo, como o fade-out da mensagem de boas-vindas, é controlada
 * por variáveis de estado e pela navegação da aplicação.
 * 
 * O componente também integra a funcionalidade de pesquisa com debounce e controle de foco
 * para um campo de pesquisa responsivo.
 */
const LayoutHeader: FC = () => {
  // Estados para controlar a autenticação, visibilidade de elementos, animações e pesquisa
  const [isAuthenticated, setIsAuthenticated] = useState(false);  // Estado que controla se o usuário está autenticado
  const [isVisible, setIsVisible] = useState(true);  // Estado que controla a visibilidade do elemento de boas-vindas
  const location = useLocation();  // Hook que fornece a localização atual da página (usado para lógica condicional)
  const isAdmin = localStorage.getItem("admin");  // Verifica se o usuário é um administrador (armazenado no localStorage)
  const [fadeOut, setFadeOut] = useState(false);  // Estado para controlar o efeito de fade-out na mensagem de boas-vindas
  const [isExpanded, setIsExpanded] = useState(false);  // Estado que controla a expansão do campo de pesquisa
  const { setSearchQuery } = useSearch();  // Hook customizado para controlar a query de pesquisa
  const [search, setSearch] = useState<string>("");  // Estado para armazenar o valor da pesquisa

  // Efeito que verifica a autenticação e manipula a exibição de elementos com base na localização
  useEffect(() => {
    const token = localStorage.getItem("access_token");  // Obtém o token de acesso armazenado no localStorage
    if(token) {
      setIsAuthenticated(true);  // Se o token existir, o usuário está autenticado
    } else {
      setIsAuthenticated(false);  // Se o token não existir, o usuário não está autenticado
    }

    if (location.pathname === '/dashboard') {
      // Se a página for '/dashboard', inicia o fade-out após 3 segundos
      const fadeTimer = setTimeout(() => {
        setFadeOut(true);  // Inicia o fade-out após 3 segundos
      }, 3000);

      // Após 5 segundos, remove o elemento de boas-vindas do DOM
      const removeTimer = setTimeout(() => {
        setIsVisible(false);  // Remove o elemento de boas-vindas após 5 segundos
      }, 5000);

      return () => {
        // Limpa os timers quando o componente for desmontado ou a localização mudar
        clearTimeout(fadeTimer);
        clearTimeout(removeTimer);
      };
    }
  }, [location]);  // O efeito depende da localização, ou seja, será reexecutado sempre que a URL mudar

  /**
   * Função que lida com a pesquisa do usuário ao pressionar a tecla Enter.
   * Quando o Enter é pressionado, o valor da pesquisa é enviado para o hook `setSearchQuery`.
   * 
   * @param e - Evento de teclado que dispara a função
   */
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setSearchQuery((e.target as HTMLInputElement).value);  // Atualiza o valor da pesquisa
  };

  return (
    <>
      {location.pathname !== '/' && (
        <header>
          <nav className="navbar bg-base-100 justify-between">
            {/* Logo */}
            <div>
              <Logo logoName={"E-Loja"} />
            </div>
            {/* Barra de Pesquisa */}
            <div className="w-full items-center flex justify-center">
              <form 
                className="relative flex items-center justify-center w-32 focus-within:w-5/12 transition-all duration-300"
                onSubmit={(e) => e.preventDefault()} // Impede o envio do formulário
              >
                <input
                  type="text"
                  value={search}  // Valor do input de pesquisa
                  onChange={(e) => setSearch(e.target.value)}  // Atualiza o estado de pesquisa quando o valor muda
                  onFocus={() => setIsExpanded(true)}  // Expande o campo de pesquisa quando o campo recebe foco
                  onBlur={() => setIsExpanded(false)}  // Retorna o campo ao tamanho normal quando perde o foco
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();  // Impede o envio do formulário ao pressionar Enter
                      handleSearch(e);  // Processa a pesquisa
                    }
                  }}
                  className={`peer cursor-pointer relative z-90 h-10 pl-10 bg-base-200 rounded-full text-gray-400 focus:w-full focus:outline-none transition-all duration-300 ${isExpanded ? "w-80 pl-8" : "w-44"}`}
                  placeholder="Pesquisar..."
                />
                <div className={`absolute inset-y-0 flex items-center gap-2 text-gray-500 ${isExpanded ? "left-3" : "-left-2"}`}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path>
                    <path d="M21 21l-6 -6"></path>
                  </svg>
                </div>
              </form>
            </div>
            {/* Carrinho e Menu de Usuário */}
            <div className="relative">
              {isAuthenticated ? (
                <>
                  {/* Mensagem de boas-vindas que desaparece após o fade-out */}
                  {location.pathname === '/dashboard' && isVisible && (
                    <div id="welcomeMsg" className={`flex transform -translate-x-1/2 w-32 text-white p-2 rounded-lg transition-opacity duration-1000 ease-in-out ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
                      <p className="font-thin text-sm italic">Bem-vindo</p>
                      <p className="ml-1 font-normal text-sm italic">
                        {(localStorage.getItem("username") ?? "").charAt(0).toUpperCase() + (localStorage.getItem("username") ?? "").slice(1)}
                      </p>
                    </div>
                  )}
                  {/* Carrinho de Compras */}
                  <div className="indicator">
                    <Carrinho />
                  </div>
                  {/* Menu de Usuário com links baseados no perfil */}
                  <div className="indicator">
                    <User
                      links={[
                        ...(isAdmin === "true" ? [{ name: "Adicionar Produto", href: "/adicionar" }] : []),
                        ...(isAdmin === "true" ? [{ name: "Editar Produto", href: "/editar" }] : []),
                        { name: "Favoritos", href: "/favoritos" },
                        { name: "Meus Pedidos", href: "/pedidos" },
                        { name: "Logout", href: "/logout" },
                      ]}
                    />
                  </div>
                </>
              ) : null}
            </div>
          </nav>
        </header>
      )}
    </>
  );
};

export default LayoutHeader;
