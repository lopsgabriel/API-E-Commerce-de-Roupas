import { FC, useEffect } from "react";
import { Logo } from "@/widgets";
import Menu from "../Menu/Menu";
import User from "../User/User";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Carrinho from "../Carrinho/Carrinho";

const LayoutHeader: FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if(token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [navigate])
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
                {/* botao de pesquisa */}
                <button className="btn-ghost btn-circle btn">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
                {/* botao do carrinho */}
                  <div className="indicator">
                    <Carrinho />
                  </div>

                {/* botao de usuario */}
                  <div className="indicator">
                  <User
                    links={[
                      { name: "Adicionar Produto", href: "/adicionar" },
                      { name: "Favoritos", href: "/favoritos" },
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
