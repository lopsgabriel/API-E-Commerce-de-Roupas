import { FC } from "react";
import { Logo } from "@/widgets/LayoutHeader/model/types";

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
