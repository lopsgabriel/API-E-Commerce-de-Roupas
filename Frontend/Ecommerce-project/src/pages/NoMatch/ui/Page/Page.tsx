import { FC } from "react";
import { Link } from "react-router-dom";

const NoMatch: FC = () => {
  /**
   * Componente que exibe uma página de erro 404.
   * Mostra uma mensagem de que a página não existe e um link para redirecionar o usuário para a página inicial.
   */
  return (
    <section>
      <div className="flex min-h-screen w-screen flex-col items-center justify-center gap-y-5">
        <h1 className="bg-gradient-to-l from-primary-content via-secondary to-primary bg-clip-text text-9xl font-bold text-transparent">
          404
        </h1>
        <p className="text-3xl font-medium text-neutral">Essa página não existe</p>
        <Link className="btn-primary-content btn px-16" to="/">
          Voltar
        </Link>
      </div>
    </section>
  );
};

export default NoMatch;
