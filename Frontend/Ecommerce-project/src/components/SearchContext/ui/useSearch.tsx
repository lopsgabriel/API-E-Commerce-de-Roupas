import { useContext } from 'react';
import { SearchContext } from './SearchContext';

// Definindo o tipo do contexto
interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

// Custom hook para acessar o contexto de pesquisa
export const useSearch = (): SearchContextType => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch deve ser usado dentro de um SearchProvider');
  }
  return context;
};
