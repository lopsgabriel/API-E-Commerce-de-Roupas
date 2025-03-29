import { FC } from "react";
import { Menu } from "../../model/types";
import { Link } from "react-router-dom";
import { FaRegUser } from "react-icons/fa";

/**
 * Componente que exibe um ícone de usuário e um menu suspenso.
 * O menu contém uma lista de links passados como propriedade, permitindo
 * que o usuário navegue para diferentes páginas do sistema.
 * 
 * O componente utiliza o ícone de usuário (FaRegUser) da biblioteca react-icons
 * e a funcionalidade de dropdown do framework TailwindCSS.
 */
const User: FC<Menu> = ({ links }: Menu) => {
  return (
    <>
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn-ghost btn-circle btn">
            <FaRegUser />
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu rounded-box menu-sm right-0 z-50 mt-3 w-52 bg-base-100 p-2 shadow"
          >
            {links.map((link) => (
              <li key={link.name}>
                <Link to={link.href}>{link.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default User;

