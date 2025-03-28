from django.contrib import admin
from .models import Categoria, Produto

# Configuração do modelo Categoria no painel de administração do Django
class Categorias(admin.ModelAdmin):
    """
    Personalização da interface de administração do modelo Categoria.

    - list_display: Define os campos que serão exibidos na lista de registros de Categoria.
    - list_display_links: Define quais campos da lista de registros serão clicáveis para editar o objeto.
    - list_per_page: Define o número de registros a serem exibidos por página na lista de categorias.
    - search_fields: Define os campos que serão utilizados para pesquisa na lista de categorias.
    - ordering: Define a ordem de exibição dos registros na lista de categorias.
    """
    list_display = ('nome', 'descricao')  # Exibe os campos 'nome' e 'descricao' na lista de categorias
    list_display_links = ('nome',)  # O campo 'nome' será o link clicável para editar a categoria
    list_per_page = 10  # Limita a exibição a 10 categorias por página
    search_fields = ('nome',)  # Permite pesquisar pelo campo 'nome' da categoria
    ordering = ('nome',)  # Ordena a lista de categorias pelo nome

# Registra o modelo Categoria no painel de administração com a classe Categorias para personalizar a exibição
admin.site.register(Categoria, Categorias)

# Configuração do modelo Produto no painel de administração do Django
class Produtos(admin.ModelAdmin):
    """
    Personalização da interface de administração do modelo Produto.

    - list_display: Define os campos que serão exibidos na lista de registros de Produto.
    - list_display_links: Define quais campos da lista de registros serão clicáveis para editar o objeto.
    - list_per_page: Define o número de registros a serem exibidos por página na lista de produtos.
    - search_fields: Define os campos que serão utilizados para pesquisa na lista de produtos.
    - ordering: Define a ordem de exibição dos registros na lista de produtos.
    """
    list_display = ('nome', 'preco', 'estoque', 'categoria')  # Exibe os campos 'nome', 'preco', 'estoque' e 'categoria' na lista de produtos
    list_display_links = ('nome', 'preco')  # Os campos 'nome' e 'preco' serão clicáveis para editar o produto
    list_per_page = 10  # Limita a exibição a 10 produtos por página
    search_fields = ('nome', 'categoria')  # Permite pesquisar pelos campos 'nome' e 'categoria' do produto
    ordering = ('nome',)  # Ordena a lista de produtos pelo nome

# Registra o modelo Produto no painel de administração com a classe Produtos para personalizar a exibição
admin.site.register(Produto, Produtos)
