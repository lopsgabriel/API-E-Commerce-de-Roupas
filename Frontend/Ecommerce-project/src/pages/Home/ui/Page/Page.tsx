import { FC, useEffect, useState } from "react"
import axios from "axios"
import React from "react";
import { Link } from 'react-router-dom';

interface Produto {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  estoque: number;
  imagem: string;
}

const Home: FC = () => {
  const [produtos, setProdutos] = useState<Produto[]>([])
  
  useEffect(() => {
    const fetchProdutos = async () => {
      const response = await axios.get(`${import.meta.env.VITE_URL}/produtos`)
      const produtos = await response.data
      setProdutos(produtos)
    }
    fetchProdutos()
  }, [])

  return (
    <>
      <section>
        <div className="hero min-h-[calc(100vh-64px)] bg-base-200">
          <div className="hero-content flex flex-col gap-4 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
              {produtos.map((produto) => (
                <React.Fragment key={produto.id}>
                  <div>
                    <Link to={`produto/${produto.id}`}>
                      {produto.imagem && (
                        <img 
                          src= {produto.imagem}
                          className="w-64 h-64 object-cover rounded-lg shadow-2xl"
                        />
                      )}
                      <h1 className="text-2xl font-bold">{produto.nome}</h1>
                      <p className="py-5">
                        {produto.descricao}
                        <br />
                        {produto.preco}
                      </p>
                    </Link>
                  </div>
                </React.Fragment>
              ))}
            </div>
            <div className="flex justify-center mt-5">
              <button className="btn-primary btn">Get Started</button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
