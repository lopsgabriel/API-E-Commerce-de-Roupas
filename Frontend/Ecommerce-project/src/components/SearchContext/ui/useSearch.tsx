import { useContext } from 'react';
import { SearchContext } from './SearchContext';

// Definindo o tipo do contexto
interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

/**
 * Custom hook para acessar o contexto de pesquisa.
 * 
 * Este hook é usado para acessar o `SearchContext` e obter o valor atual da busca (`searchQuery`) e
 * a função para atualizá-la (`setSearchQuery`).
 * Ele garante que o hook seja usado apenas dentro de um componente que está envolvido pelo `SearchProvider`.
 * 
 */
export const useSearch = (): SearchContextType => {
  // Acessa o contexto de pesquisa
  const context = useContext(SearchContext);

  // Verifica se o contexto existe (ou seja, se o hook está sendo usado dentro de um SearchProvider)
  if (!context) {
    throw new Error('useSearch deve ser usado dentro de um SearchProvider');
  }

  // Retorna o contexto
  return context;
};
