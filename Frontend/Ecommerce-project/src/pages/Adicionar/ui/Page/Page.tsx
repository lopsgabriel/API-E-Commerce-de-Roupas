import { FC, useState, ChangeEvent, FormEvent } from "react";

interface Produto {
  nome: string;
  descricao: string;
  preco: string;
  estoque: string;
  categoria: string;
  foto: File | null;
}


const Adicionar: FC = () => {
  const [produto, setProduto] = useState<Produto>({
    nome: "",
    descricao: "",
    preco: "",
    estoque: "",
    categoria: "",
    foto: null,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProduto({ ...produto, [name]: value });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setProduto({ ...produto, foto: e.target.files[0] });
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Substitua por lógica para enviar ao backend
    console.log(produto);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200 ">
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
          <input
            type="text"
            id="categoria"
            name="categoria"
            value={produto.categoria}
            onChange={handleChange}
            className="w-full px-4 bg-base-100 py-2 border rounded"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="foto" className="block font-medium mb-2">Foto:</label>
          <input
            type="file"
            id="foto"
            name="foto"
            onChange={handleFileChange}
            className="w-full"
            required
          />
        </div>

        <button type="submit" className="w-full py-2 px-4 bg-blue-500 text-white font-bold rounded hover:bg-blue-600">
          Adicionar Produto
        </button>
      </form>
    </div>
  );
};

export default Adicionar;
