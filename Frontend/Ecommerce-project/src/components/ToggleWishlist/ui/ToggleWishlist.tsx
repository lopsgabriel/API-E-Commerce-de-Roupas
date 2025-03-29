import axios from "axios";

/**
 * Função para adicionar ou remover um produto da lista de desejos de um usuário.
 * Faz uma requisição `POST` para o endpoint `/listaDesejos/` com o ID do produto e o ID do usuário.
 * Dependendo do estado atual, o produto é adicionado ou removido da lista de desejos.
 */
const ToggleWishlist = async (produtoId: number, usuarioId: number) => {
  const refreshtoken = localStorage.getItem("access_token");

  const response = await axios.post(
    `${import.meta.env.VITE_URL}/listaDesejos/`,
    {
      produto: produtoId,
      usuario: usuarioId
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${refreshtoken}`
      }
    }
  );

  return response;
};

export default ToggleWishlist;
