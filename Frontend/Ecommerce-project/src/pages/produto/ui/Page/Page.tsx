import { FC, useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import { fetchAuthApi } from "@/components";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { VscHeartFilled } from "react-icons/vsc";
import { VscHeart } from "react-icons/vsc";

interface Produto {
  id: number;
  nome: string;
  descricao: string;
  categoria: number;
  preco: number;
  estoque: number;
  imagem: string;
}

interface ListaDesejo {
  usuario: number | null,
  usuario_nome: string,
  produto: number,
  produto_nome: string
}

interface dadosProduto {
  id: number;
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

interface NotificationProps {
  message: string;
  onClose: () => void;
}


const Notification = ({ message, onClose }: NotificationProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 790 }} 
      animate={{ opacity: 1, y: 590 }} 
      exit={{ opacity: 0, y: 790 }} 
      className="fixed top-4 right-4 bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg"
    >
      {message}
      <button onClick={onClose} className="ml-4 text-white font-bold">×</button>
    </motion.div>
  );
};

/**
 * Componente Produto que exibe os detalhes de um produto específico, 
 * permitindo ao usuário adicionar o produto ao carrinho.
 * 
 * O componente busca as informações do produto e a lista do carrinho 
 * a partir de uma API, usando o hook `useEffect`.
 * 
 * A quantidade do produto pode ser alterada pelo usuário, e, ao clicar 
 * no botão de compra, o produto é adicionado ao carrinho ou a quantidade 
 * do produto é atualizada no carrinho.
 * 
 * O componente também gerencia a navegação, autenticando as requisições 
 * usando os tokens armazenados no `localStorage`.
 */
const Produto: FC = () => {
  const [produto, setProduto] = useState<dadosProduto>({} as dadosProduto)
  const [quantidade, setQuantidade] = useState(1);
  const [listaDesejos, setListaDesejos] = useState<ListaDesejo[]>([])
  const { id_produto } = useParams<{ id_produto: string }>();
  const navigate = useNavigate();
  const user_id = localStorage.getItem("user_id");
  const [listaCarrinho, setListaCarrinho] = useState<ProdutosCarrinho[]>([]);
  const [showNotification, setShowNotification] = useState(false);

  /**
   * Função que faz a requisição das informações do produto, categoria 
   * e do carrinho do usuário, e atualiza os estados correspondentes 
   * com os dados obtidos.
   */
  useEffect(() => {
    const fetchProduto = async () => {
      const refresh_token = localStorage.getItem('refresh_token');
      const produtoData = await fetchAuthApi(`${import.meta.env.VITE_URL}/produtos/${id_produto}/`, refresh_token, navigate);
      const cat_response = await fetchAuthApi(`${import.meta.env.VITE_URL}/categorias/${produtoData.categoria}/`, refresh_token, navigate);
      const categoria = await cat_response;

      const listaCarrinhoData = await fetchAuthApi(`${import.meta.env.VITE_URL}/carrinhos/${user_id}/`, refresh_token, navigate);
      setListaCarrinho(listaCarrinhoData);
      setProduto({
        ...produtoData,
        categoria: categoria.nome,
      });
      const listaDesejosData = await fetchAuthApi(`${import.meta.env.VITE_URL}/listaDesejos/${user_id}`, refresh_token, navigate );
              setListaDesejos(listaDesejosData.map((produto: ListaDesejo) => ({ produto: produto.produto })));
    };
    fetchProduto();
  }, [id_produto, navigate, user_id]);

  /**
   * Função que atualiza a lista de itens no carrinho a partir de uma 
   * requisição à API.
   */
  async function atualizarCarrinho() {
    const refresh_token = localStorage.getItem('access_token');
    const carrinhoData = await fetchAuthApi(`${import.meta.env.VITE_URL}/carrinhos/${user_id}/`, refresh_token, navigate);
    setListaCarrinho(carrinhoData);
  }

  /**
   * Função que é chamada quando o usuário clica no botão de "Comprar".
   * Ela verifica se o produto já está no carrinho, e, em caso afirmativo,
   * atualiza a quantidade do produto. Caso contrário, adiciona o produto 
   * ao carrinho com a quantidade desejada.
   * Após isso, o carrinho é atualizado e o usuário é redirecionado para 
   * a página do carrinho.
   */
  async function toggleFavorite() {
    const listas: Record<string, { produto: number }[]> = {
      listaDesejos: listaDesejos.map((item) => ({ produto: item.produto }))
    };

    const setListas = {
      listaDesejos: setListaDesejos
    };

    try {
      const refreshtoken = localStorage.getItem("access_token");

      // Verificar se o produto ta na lista
      const lista = listas.listaDesejos;
      const isInLista = lista.some(item => item.produto === produto.id);

      if (isInLista) {
        // Remover da lista
        await axios.delete(`${import.meta.env.VITE_URL}/listaDesejos/${user_id}/${produto.id}/`, {
          headers: { 'Authorization': `Bearer ${refreshtoken}` }
        });
      } else {
          await axios.post(
            `${import.meta.env.VITE_URL}/listaDesejos/${user_id}/`,
            {
              'usuario': user_id,
              'produto': produto.id
            },
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${refreshtoken}`
              }
            }
          )
          setListas.listaDesejos((prev: ListaDesejo[]) => [...prev, { usuario: Number(user_id), usuario_nome: "", produto: produto.id, produto_nome: "" }]);
        
      }
    } catch (error) {
      console.error("Erro ao atualizar a lista ", error);
    }
  }

  const handleComprar = async () => {
    console.log(`${user_id} ${id_produto} ${quantidade}`);
    const matchingItem = listaCarrinho.find((item) => item.produto === parseInt(id_produto ?? ''));
    if (matchingItem) {
      const refresh_token = localStorage.getItem('access_token');
      await axios.put(
        `${import.meta.env.VITE_URL}carrinhos/${user_id}/${id_produto}/`,
        {
          'usuario': user_id,
          'produto': id_produto,
          'quantidade': quantidade + matchingItem.quantidade
        },
        { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${refresh_token}` } }
      );
      console.log('Produto atualizado no carrinho!');
    } else {
      const refresh_token = localStorage.getItem('access_token');
      await axios.post(
        `${import.meta.env.VITE_URL}carrinhos/${user_id}/`,
        {
          'usuario': user_id,
          'produto': id_produto,
          'quantidade': quantidade
        },
        { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${refresh_token}` } }
      );
      console.log('Produto adicionado ao carrinho!');
    }
    atualizarCarrinho();
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  }

  return (
    <section>
      <div className="hero min-h-[calc(100vh-64px)] bg-base-200 flex items-center justify-center p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 rounded-xl shadow-lg max-w-4xl w-full">
          {/* Coluna esquerda */}
          <div className="flex justify-center items-center">
            <img 
              src={produto.imagem} 
              className="w-full max-w-md h-auto object-cover rounded-lg shadow-md"
              alt={produto.nome}
            />
          </div>
  
          {/* Coluna direita */}
          <div className="flex flex-col justify-center p-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{produto.nome}</h1>
            <p className="text-gray-600 text-lg mb-4">{produto.descricao}</p>
            <span className="text-sm font-semibold text-gray-500">Categoria: {produto.categoria}</span>
            
            <div className="mt-4 p-4 bg-gray-100 rounded-lg flex flex-col items-start">
              <h2 className="text-2xl font-bold text-green-600">R$ {produto.preco}</h2>
              <span className="text-sm text-gray-500">Estoque: {produto.estoque} unidades</span>
            </div>
            
            {/* Seção de quantidade e botão */}
            <div className="mt-6 flex items-center gap-4">
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  toggleFavorite();
                }}
                className=" right-4 top-4 hover:scale-110 duration-100 text-black icon-heart z-10"
              >
                {
                  listaDesejos.some((item) => item.produto === produto.id) ? (
                    <VscHeartFilled size={20} />
                  ) : (
                    <VscHeart size={20} />
                  )
                }
              </button>
              <input
                type="number"
                min="1"
                max={produto.estoque}
                value={quantidade}
                onChange={(e) => setQuantidade(parseInt(e.target.value))}
                className="w-20 text-center border border-gray-300 rounded-lg p-2 shadow-sm"
              />
              <button onClick={() => handleComprar()} className="bg-blue-600 text-white text-sm font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 transition-all">
                ADICIONAR AO CARRINHO
              </button>
            </div>
          </div>
        </div>
        <AnimatePresence>
          {showNotification && <Notification message="Item adicionado ao carrinho!" onClose={() => setShowNotification(false)} />}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Produto;
