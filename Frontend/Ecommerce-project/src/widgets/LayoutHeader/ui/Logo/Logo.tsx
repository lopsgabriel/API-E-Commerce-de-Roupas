import { FC } from "react";
import type { Logo } from "@/widgets/LayoutHeader/model/types";

/**
 * Componente `Logo` exibe o logo da aplicação dentro da barra de navegação.
 * Ele inclui um ícone de logo e o nome da logo, que são passados como uma propriedade `logoName`.
 * O componente permite que o usuário seja redirecionado para o dashboard ao clicar no logo.
 *
 * @param logoName - O nome a ser exibido ao lado do logo, recebido como uma propriedade do tipo `Logo`.
 * 
 * @returns JSX.Element - Retorna um elemento JSX contendo o logo e o nome exibido na barra de navegação.
 */
const Logo: FC<Logo> = ({ logoName }: Logo) => {
  return (
    <div className="navbar-center">
      <a href="/dashboard" className="btn-ghost btn text-xl normal-case">
        <img
          src="/logo-White.svg"
          alt="Logo"
          className="w-7 h-7"
        />
        {logoName}
      </a>
    </div>
  );
};

export default Logo;
