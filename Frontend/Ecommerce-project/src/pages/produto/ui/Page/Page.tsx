import { FC, useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import { fetchAuthApi } from "@/components";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Produto {
  id: number;
  nome: string;
  descricao: string;
  categoria: number;
  preco: number;
  estoque: number;
  imagem: string;
}

interface dadosProduto {
  nome: string;
  descricao: string;
  categoria: string;
  preco: number;
  estoque: number;
  imagem: string;
}

interface ProdutosCarrinho {
  usuario: number;
  produto: number;
  quantidade: number;
}

const Produto: FC = () => {
  const [produto, setProduto] = useState<dadosProduto>({} as dadosProduto)
  const [quantidade, setQuantidade] = useState(1);
  const {id_produto} = useParams<{ id_produto: string }>();
  const navigate = useNavigate();
  const user_id = localStorage.getItem("user_id");
  const [listaCarrinho, setListaCarrinho] = useState<ProdutosCarrinho[]>([])

  useEffect(() => {
    const fetchProduto = async () => {
      const refresh_token = localStorage.getItem('refresh_token')
      const produtoData = await fetchAuthApi(`${import.meta.env.VITE_URL}/produtos/${id_produto}/`, refresh_token, navigate)
      const cat_response = await fetchAuthApi(`${import.meta.env.VITE_URL}/categorias/${produtoData.categoria}/`, refresh_token, navigate);
      const categoria = await cat_response

      const listaCarrinhoData = await fetchAuthApi(`${import.meta.env.VITE_URL}/carrinhos/${user_id}/`, refresh_token, navigate );
      setListaCarrinho(listaCarrinhoData);
      setProduto({
        ...produtoData,
        categoria: categoria.nome, 
      });
    }
    fetchProduto()
  }, [id_produto, navigate, user_id, ])


  async function atualizarCarrinho() {
    const refresh_token = localStorage.getItem('access_token')
    const carrinhoData = await fetchAuthApi(`${import.meta.env.VITE_URL}/carrinhos/${user_id}/`, refresh_token, navigate);
    setListaCarrinho(carrinhoData);
  }

  const handleComprar = async () => {
    console.log(`${user_id} ${id_produto} ${quantidade}`)
    const matchingItem = listaCarrinho.find((item) => item.produto === parseInt(id_produto ?? ''));
    if (matchingItem) {
      const refresh_token = localStorage.getItem('access_token')
      await axios.put(
        `${import.meta.env.VITE_URL}carrinhos/${user_id}/${id_produto}/`,
        {
          'usuario': user_id,
          'produto': id_produto,
          'quantidade': quantidade + matchingItem.quantidade
        },
        { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${refresh_token}` } }
      );
      console.log('Produto atualizado no carrinho!')
    } else {
      const refresh_token = localStorage.getItem('access_token')
    await axios.post(
      `${import.meta.env.VITE_URL}carrinhos/${user_id}/`,
      {
        'usuario': user_id,
        'produto': id_produto,
        'quantidade': quantidade
      },
      { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${refresh_token}` } }
    );
    console.log('Produto adicionado ao carrinho!')
    }
    atualizarCarrinho()
    navigate('/cart')
  }

  return (
    <>
      <section>
        <div className="hero min-h-[calc(100vh-64px)] bg-base-200">
            <div className="grid grid-cols-2 gap-4 items-center justify-center h-full px-4">
                {/* Coluna esquerda */}
                <div className="flex justify-center items-center">
                  <img src={produto.imagem} className="w-64 h-64 object-cover rounded-lg shadow-2xl"></img>
                </div>

                {/* Coluna direita */}
                <div className="flex-col ml-4">
                  <h1 className="text-2xl font-bold">{produto.nome}</h1>
                  <p className='max-w-md text-justify' >{produto.descricao}</p>
                  <h1>{produto.categoria}</h1>
                  <h1 className="text-2xl font-bold"> {produto.preco}</h1>
                  {/* Seção de quantidade e botão */}
                  <div className="mt-auto flex items-center gap-4">
                    {/* Input para quantidade */}
                    <input 
                      type="number" 
                      min="1" 
                      max={produto.estoque}
                      value={quantidade} 
                      onChange={(e) => setQuantidade(parseInt(e.target.value))}
                      className="w-16 text-center border border-gray-300 rounded-lg p-2"
                    />
                    {/* Botão de compra */}
                    <button onClick={handleComprar} className="btn btn-primary">Comprar</button>
                  </div>
                </div>
            </div>
        </div>
      </section>
    </>
  );
};

export default Produto;
