import axios from "axios";

const ToggleWishlist = async(produtoId: number, usuarioId: number, ) => {
  const refreshtoken = localStorage.getItem("access_token");
  const response = await axios.post(`${import.meta.env.VITE_URL}/listaDesejos/`,{ 
      produto: produtoId,
      usuario: usuarioId
      },
       { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${refreshtoken}` } }
      )
  return response
}

export default ToggleWishlist