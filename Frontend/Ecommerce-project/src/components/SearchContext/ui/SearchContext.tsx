import { createContext, useState, FC } from 'react';

// Definindo o tipo do contexto
interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

// Criando o contexto
const SearchContext = createContext<SearchContextType | undefined>(undefined);

/**
 * Componente Provider que fornece o contexto de busca para toda a aplicação.
 * 
 * O componente `SearchProvider` envolve a aplicação, permitindo que qualquer componente filho acesse o contexto
 * de busca (`searchQuery`) e o atualize usando a função `setSearchQuery`.
 * 
 */
export const SearchProvider: FC<{ children: React.ReactNode }> = ({ children }) => { 
  // Estado que armazena o valor da busca
  const [searchQuery, setSearchQuery] = useState<string>('');

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
      {children}
    </SearchContext.Provider>
  );
};

// Exportando o contexto para ser usado em outros arquivos
export { SearchContext };
