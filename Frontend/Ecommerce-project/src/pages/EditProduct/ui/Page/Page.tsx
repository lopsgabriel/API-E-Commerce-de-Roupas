import { fetchAuthApi } from "@/components";
import { ChangeEvent, FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Produto {
  id: number;
  nome: string;
  descricao: string;
  categoria: string;
  preco: number;
  estoque: number;
  imagem: string;
}

interface Categoria {
  id: number
  nome: string
}

const EditProduct: FC = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [selectedProduto, setSelectedProduto] = useState<Produto | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const navigate = useNavigate();
  const [optionsVisible, setoptionsVisible] = useState(true);
  const [produtoVisible, setProdutoVisible] = useState(false);
  const [categorias, setCategorias] = useState<Categoria[]>([])

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const refreshtoken = localStorage.getItem("refresh_token");
        const produtosData = await fetchAuthApi(`${import.meta.env.VITE_URL}/produtos/`, refreshtoken, navigate);

        const produtosComCategoria = await Promise.all(
          produtosData.map(async (produto: Produto) => {
            const catResponse = await fetchAuthApi(`${import.meta.env.VITE_URL}/categorias/${produto.categoria}/`, refreshtoken, navigate);
            return {
              ...produto,
              categoria: catResponse.id,
            };
          })
        );

        setProdutos(produtosComCategoria);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    };

    const fetchCategorias = async () => {
      try {
        const response = await axios.get<Categoria[]>(`${import.meta.env.VITE_URL}/categorias`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        })
        setCategorias(response.data)
      } catch (error) {
        console.error("Erro ao buscar categorias:", error)
      }
    }

    fetchCategorias();
    fetchProdutos();
  }, [navigate]);

  const handleChange = (e: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setSelectedProduto(selectedProduto ? { ...selectedProduto, [name]: value } : null)
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        setSelectedFile(file); // Armazena o arquivo separadamente
        setSelectedProduto((prev) => {
          if (!prev) return null; // Se o estado anterior for null, mantém null para evitar erros
          
          return { 
              ...prev, 
              imagem: URL.createObjectURL(file) 
          };
      }); 
    }
};

  const handleSave = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedProduto) {
      try {
        const access_token = localStorage.getItem("access_token");
        const formData = new FormData();
            formData.append("nome", selectedProduto.nome);
            formData.append("descricao", selectedProduto.descricao);
            formData.append("preco", selectedProduto.preco.toString());
            formData.append("estoque", selectedProduto.estoque.toString());

            // Garantindo que a categoria seja enviada como ID numérico
            formData.append("categoria", String(selectedProduto.categoria));

            if (selectedFile) {
              formData.append("imagem", selectedFile); // Adiciona a nova imagem apenas se for selecionada
          }

        await axios.put(`${import.meta.env.VITE_URL}/produtos/${selectedProduto.id}/`, formData, {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${access_token}`,
          }
        });
        navigate("/");
      } catch (error) {
        console.error("Erro ao editar produto:", error);
      }
    }
  };


  return (
    <div className="hero min-h-[calc(100vh-64px)] bg-base-200">
      <div className="hero-content flex pb-32 gap-4 w-full">
        <div className="bg-base-100 flex flex-col justify-between p-4 w-4/6 rounded-xl overflow-auto">
          <div>
            {optionsVisible && (
              <>
                <h1 className="font-bold mb-4">Escolha um produto que deseja editar.</h1>
                <select
                  onChange={(e) => {
                    const selectedId = parseInt(e.target.value);
                    const produto = produtos.find((p) => p.id === selectedId);
                    setSelectedProduto(produto || null);
                    setoptionsVisible(false);
                    setProdutoVisible(true);
                  }}
                  className="select select-bordered w-full max-w-xs"
                >
                  <option value="">Selecione um produto</option>
                  {produtos.map((produto) => (
                    <option key={produto.id} value={produto.id}>
                      {produto.nome}
                    </option>
                  ))}
                </select>
              </>
            )}
            {selectedProduto && produtoVisible && (
              <form onSubmit={handleSave}>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Nome</span>
                  </label>
                  <input
                    type="text"
                    id="nome"
                    name="nome"
                    value={selectedProduto.nome}
                    onChange={handleChange}
                    className="input input-bordered"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Descrição</span>
                  </label>
                  <input
                    type="text"
                    id="descricao"
                    name="descricao"
                    value={selectedProduto.descricao}
                    onChange={handleChange}
                    className="input input-bordered"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Preço</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    id="preco"
                    name="preco"
                    value={selectedProduto.preco}
                    onChange={handleChange}
                    className="input input-bordered"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Estoque</span>
                  </label>
                  <input
                    type="number"
                    id="estoque"
                    name="estoque"
                    value={selectedProduto.estoque}
                    onChange={handleChange}
                    className="input input-bordered"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Categoria</span>
                  </label>
                  <select
                    id="categoria"
                    name="categoria"
                    value={selectedProduto.categoria}
                    onChange={handleChange}
                    className="select select-bordered w-full max-w-xs"
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
                <div className="form-control ">
                  <label className="label">
                    <span className="label-text">Imagem</span>
                  </label>
                  {selectedProduto.imagem && (
                    <img src={selectedProduto.imagem} alt="Imagem do produto" className="w-32 h-32 object-cover rounded-lg mb-2" />
                  )}
                  <input
                    type="file"
                    id="imagem"
                    name="imagem"
                    className="input input-bordered flex items-center justify-center"
                    onChange={handleFileChange}
                  />
                </div>
  
                {/* Botões dentro do form */}
                <div className="flex justify-between mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setoptionsVisible(true);
                      setProdutoVisible(false);
                      setSelectedProduto(null);
                    }}
                    className="btn bg-red-500 text-black hover:bg-red-600"
                  >
                    Voltar
                  </button>
  
                  <button type="submit" className="btn btn-success hover:bg-emerald-500 text-white">
                    Salvar
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
  
};

export default EditProduct;