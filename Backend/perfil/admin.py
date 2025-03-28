from django.contrib import admin
from .models import Perfil, Item_carrinho, Lista_Desejos, ItemPedido, Pedido

# Definindo um inline para o modelo ItemPedido. Isso permite a edição dos itens do pedido diretamente na interface de admin do Pedido.
class ItemPedidoInline(admin.TabularInline):
    """
    Classe para configurar a exibição e a manipulação dos itens de um pedido diretamente na interface de admin.

    O modelo ItemPedido será exibido como um formulário tabular (linha por linha) dentro da página do Pedido.
    A configuração extra=1 adiciona um formulário vazio adicional para a criação de um novo ItemPedido.
    """
    model = ItemPedido
    extra = 1  # Adiciona um item em branco para facilitar a criação de novos itens de pedido

# Definindo um inline para o modelo Lista_Desejos. Permite adicionar e editar produtos desejados diretamente dentro da página de Perfil.
class ListaDesejosInline(admin.TabularInline):
    """
    Classe para exibir os produtos da Lista de Desejos do usuário na interface de admin.

    Esse inline permite que os produtos adicionados à lista de desejos sejam exibidos e manipulados diretamente na página de administração do Perfil.
    """
    model = Lista_Desejos
    extra = 1  # Adiciona um item em branco para a criação de novos itens na lista de desejos

# Definindo um inline para o modelo Item_carrinho. Permite adicionar e editar os itens do carrinho de compras diretamente na página do Perfil.
class ItemCarrinhoInline(admin.TabularInline):
    """
    Classe para exibir os itens do carrinho de compras do usuário diretamente na interface de admin.

    Permite que os itens no carrinho sejam visualizados e manipulados diretamente na página de administração do Perfil.
    """
    model = Item_carrinho
    extra = 1  # Adiciona um item em branco para facilitar a criação de novos itens no carrinho de compras

# Classe admin para configurar a exibição do modelo Perfil no painel de administração.
class PerfilAdmin(admin.ModelAdmin):
    """
    Personalização da interface de administração do modelo Perfil.

    - list_display: Define os campos a serem exibidos na lista de registros de Perfil.
    - inlines: Adiciona os inlines configurados (carrinho e lista de desejos) à página de administração do Perfil.
    """
    list_display = ('usuario', 'carteira')  # Exibe o nome do usuário e a carteira do perfil na lista
    inlines = [ItemCarrinhoInline, ListaDesejosInline]  # Exibe os itens de carrinho e lista de desejos diretamente na página de admin do Perfil

# Classe admin para configurar a exibição do modelo Pedido no painel de administração.
class PedidoAdmin(admin.ModelAdmin):
    """
    Personalização da interface de administração do modelo Pedido.

    - inlines: Adiciona os itens do pedido (ItemPedido) à página de administração do Pedido.
    """
    inlines = [ItemPedidoInline]  # Exibe os itens do pedido diretamente na página de administração do Pedido

# Registrar os modelos no admin para que fiquem disponíveis na interface de administração do Django.
admin.site.register(Perfil, PerfilAdmin)
admin.site.register(Pedido, PedidoAdmin)
