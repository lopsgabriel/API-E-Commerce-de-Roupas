import { FC, useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

interface Produto {
  nome: string
  descricao: string
  preco: number
  estoque: number
  categoria: number
  foto: File | null
}

interface DadosResposta {
  id: number
  success: boolean
}

interface Categoria {
  id: number
  nome: string
}

const Adicionar: FC = () => {
  const navigate = useNavigate()
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [produto, setProduto] = useState<Produto>({
    nome: "",
    descricao: "",
    preco: 0,
    estoque: 0,
    categoria: 0,
    foto: null,
  })
  
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get<Categoria[]>(`${import.meta.env.VITE_URL}/categorias`)
        setCategorias(response.data)
      } catch (error) {
        console.error("Erro ao buscar categorias:", error)
      }
    }

    fetchCategorias();
  }, []);
  const CriarProduto = async (produto: Produto) => {
    const formData = new FormData();
    formData.append("nome", produto.nome)
    formData.append("descricao", produto.descricao)
    formData.append("preco", String(produto.preco))
    formData.append("estoque", String(produto.estoque))
    formData.append("categoria", String(produto.categoria))
    if (produto.foto) {
      formData.append("imagem", produto.foto as File)
    }

    try {
      const response = await axios.post<DadosResposta>(`${import.meta.env.VITE_URL}produtos/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      console.log(response.data)
      // quero que seja redirecionado para pagina principal depois que o produto for criado
      navigate('/')

    } catch (error ) {
      if (error instanceof AxiosError) {
        console.error("Erro na resposta:", error.response?.data)
        console.error("Código de status:", error.response?.status)
      } else {
        console.error("Erro ao enviar o produto:", error)
      }
    }
  }

  const handleChange = (e: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProduto({ ...produto, [name]: value })
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
        setProduto({ ...produto, foto: e.target.files[0] })
        console.log("Arquivo selecionado:", e.target.files[0])
        console.log(produto)
    } else {
        console.warn("Nenhum arquivo selecionado");
    }
}

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      if (produto.foto) {
        await CriarProduto(produto)
      }
      
    } catch (error) {
      console.error('Erro ao criar produto:', error)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200 py-3">
      <form onSubmit={handleSubmit} className=" bg-base-100  p-8 rounded-xl shadow-lg w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Adicionar Produto</h1>
        <div className="mb-4">
          <label htmlFor="nome" className="block font-medium mb-2">Nome:</label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={produto.nome}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-base-100 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="descricao" className="block font-medium mb-2">Descrição:</label>
          <textarea
            id="descricao"
            name="descricao"
            value={produto.descricao}
            onChange={handleChange}
            className="w-full px-4 bg-base-100 py-2 border rounded"
            rows={3}
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="preco" className="block font-medium mb-2">Preço:</label>
          <input
            type="number"
            id="preco"
            name="preco"
            value={produto.preco}
            onChange={handleChange}
            className="w-full px-4 bg-base-100 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="estoque" className="block font-medium mb-2">Estoque:</label>
          <input
            type="number"
            id="estoque"
            name="estoque"
            value={produto.estoque}
            onChange={handleChange}
            className="w-full px-4 bg-base-100 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="categoria" className="block font-medium mb-2">Categoria:</label>
          <select
            id="categoria"
            name="categoria"
            value={produto.categoria}
            onChange={handleChange}
            className="w-full px-4 bg-base-100 py-2 border rounded"
            required
          >
            <option value={0}>Selecione uma categoria</option>
            {categorias.map(categoria => (
              <option key={categoria.id} value={categoria.id} >
                {categoria.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label htmlFor="foto" className="block font-medium mb-2">Foto:</label>
          <input
            type="file"
            id="foto"
            name="foto"
            onChange={handleFileChange}
            className="w-full px-4 bg-base-100 py-2 border rounded"
            required
          />
        </div>
        <button type="submit" className="w-full py-2 px-4 bg-blue-500 text-white font-bold rounded hover:bg-blue-600">
          Adicionar Produto
        </button>
      </form>
    </div>
  )
}

export default Adicionar
