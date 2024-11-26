// ao clicar no icone do carrinho, o programa deve mostrar uma mini janela  com os itens do carrinho do usuario

import { FC } from "react";
import { Menu } from "../../model/types";
import { Link } from "react-router-dom";
import { TbShoppingCart } from "react-icons/tb";

const Carrinho: FC<Menu> = ({ links }: Menu) => {
  return (
    <>
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn-ghost btn-circle btn">
            <TbShoppingCart />
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

export default Carrinho;
