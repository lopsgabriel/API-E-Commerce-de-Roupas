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
      navigate("/")
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
          <div className="navbar-end">
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
                <button className="btn-ghost btn-circle btn">
                  <div className="indicator">
                    <Carrinho />
                  </div>
                </button>

                {/* botao de usuario */}
                <button className="btn-ghost btn-circle btn">
                  <div className="indicator">
                  <User
                    links={[
                      { name: "Adicionar Produto", href: "/adicionar" },
                      { name: "Logout", href: "/logout" },
                    ]}
                  />
                  </div>
                </button>
              </>
            ):null }
          </div>
        </nav>
      </header>
    </>
  );
};

export default LayoutHeader;
