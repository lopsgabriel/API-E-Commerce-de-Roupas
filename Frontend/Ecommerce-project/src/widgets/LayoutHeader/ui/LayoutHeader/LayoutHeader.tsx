import { FC, useEffect } from "react";
import { Logo } from "@/widgets";
import Menu from "../Menu/Menu";
import User from "../User/User";
import { useState } from "react";
import Carrinho from "../Carrinho/Carrinho";
import { useLocation } from 'react-router-dom';
import { useSearch } from "@/components";


const LayoutHeader: FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const location = useLocation(); 
  const isAdmin = localStorage.getItem("admin");
  const [fadeOut, setFadeOut] = useState(false);  // Novo estado para fade-out
  const [isExpanded, setIsExpanded] = useState(false);
  const { setSearchQuery } = useSearch();
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if(token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }

    if (location.pathname === '/dashboard') {
      // Primeiro inicia o fade-out após 3 segundos
      const fadeTimer = setTimeout(() => {
        setFadeOut(true);
      }, 3000);  // Inicia o fade-out aos 3 segundos

      // Depois de 5 segundos, remove o elemento do DOM
      const removeTimer = setTimeout(() => {
        setIsVisible(false);
      }, 5000);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(removeTimer);
      };
    }
  }, [ location])

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setSearchQuery((e.target as HTMLInputElement).value);
  };
  
  
  return (
    <>
      <header>
        <nav className="navbar bg-base-100">
          <Menu
            links={[
              { name: "About", href: "/about" },
            ]}
          />
          <Logo logoName={"E-Loja"} />
          <div className="navbar-end relative">
            {isAuthenticated ? (
              <>
                {location.pathname === '/dashboard' && isVisible && ( // Condiciona a renderização à home e visibilidade
                  <div id="welcomeMsg" className={`flex transform -translate-x-1/2  text-white p-2 rounded-lg transition-opacity duration-1000 ease-in-out ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
                  >
                    <p className="font-thin text-sm italic">Bem-vindo</p>
                    <p className="ml-1 font-normal text-sm italic">{(localStorage.getItem("username") ?? "").charAt(0).toUpperCase() + (localStorage.getItem("username") ?? "").slice(1)}</p>
                  </div>
                )}
                <form className="relative w-32 mr-10 focus-within:w-5/12 transition-all duration-300"
                  onSubmit={(e) => e.preventDefault()}>
                  <input
                    type="text"
                    value={search}
                    onChange ={(e) => setSearch(e.target.value)}
                    onFocus={() => setIsExpanded(true)}
                    onBlur={() => setIsExpanded(false)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault(); // Impede o envio do formulário ao pressionar Enter
                        handleSearch(e); // Agora processa a pesquisa somente quando o Enter for pressionado
                      }
                    }}
                    className={`peer cursor-pointer relative z-90 h-10 w-40 pl-10 bg-base-200 rounded-full text-gray-400 focus:w-full focus:pl-10 focus:outline-none transition-all duration-300 ${
                      isExpanded ? "w-28" : "w-16"
                    }`}
                    placeholder="Pesquisar..."
                  />
                  <div className="absolute inset-y-0 left-4 flex items-center gap-2 text-gray-500">
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
                  <div className="indicator">
                    <Carrinho />
                  </div>
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
            ):null }
          </div>
        </nav>
      </header>
    </>
  );
};

export default LayoutHeader;
