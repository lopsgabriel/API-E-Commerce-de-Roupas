# E-Commerce de Roupas

Este é um sistema de e-commerce simulando uma loja de roupas. Ele permite que clientes comprem produtos, favoritem itens, adicionem ao carrinho, pesquisem e filtrem por categorias. Além disso, usuários administradores podem editar e adicionar itens.

## Funcionalidades

- 🛒 **Carrinho de compras**: Adicione e remova produtos do carrinho antes da compra.
- ❤️ **Favoritos**: Marque itens como favoritos para acessá-los rapidamente.
- 🔍 **Pesquisa e filtros**: Encontre produtos por nome ou categoria.
- 👤 **Autenticação**: Cadastro e login de usuários.
- 🏬 **Gestão de produtos**: Administradores podem adicionar, editar e remover produtos.
- 📦 **Controle de estoque**: O estoque é atualizado automaticamente após uma compra.

## Tecnologias Utilizadas

### Backend
- **Django Rest Framework** (DRF) - API REST
- **SQLite** - Banco de dados
- **Autenticação com JWT** - Controle de usuários e permissões

### Frontend
- **React + Vite** - Interface interativa e rápida
- **Tailwind CSS** - Estilização moderna e responsiva
- **Axios** - Comunicação com a API

## Como Executar o Projeto

### Backend
1. Clone o repositório:
   ```bash
   git clone https://github.com/lopsgabriel/API-E-Commerce-de-Roupas.git
   ```
2. Acesse a pasta do projeto:
   ```bash
   cd ecommerce-loja/backend
   ```
3. Crie e ative um ambiente virtual:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   venv\Scripts\activate  # Windows
   ```
4. Instale as dependências:
   ```bash
   pip install -r requirements.txt
   ```
5. Execute as migrações e inicie o servidor:
   ```bash
   python manage.py migrate
   python manage.py runserver
   ```

### Frontend
1. Acesse a pasta do frontend:
   ```bash
   cd ../frontend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

## Contribuição
Sinta-se à vontade para contribuir com melhorias! Faça um fork do projeto, crie uma branch para sua funcionalidade e envie um pull request.

## Licença
Este projeto está sob a licença MIT.

## Contato
📧 E-mail: [souzsgabriel12@gmail.com](mailto:souzsgabriel12@gmail.com)

🔗 LinkedIn: [lopsgabriel](https://www.linkedin.com/in/lopsgabriel/)

📸 Instagram: [lopsgabriel.s](https://www.instagram.com/lopsgabriel.s/)

