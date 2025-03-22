import { createContext, useState, FC } from 'react';

// Definindo o tipo do contexto
interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

// Criando o contexto
const SearchContext = createContext<SearchContextType | undefined>(undefined);

// Componente Provider que envolverá toda a aplicação
export const SearchProvider: FC<{ children: React.ReactNode }> = ({ children }) => { 
  const [searchQuery, setSearchQuery] = useState<string>('');

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
      {children}
    </SearchContext.Provider>
  );
};

// Exportando o contexto para ser usado em outros arquivos
export { SearchContext };
