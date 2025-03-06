from django.contrib import admin
from .models import Perfil, Item_carrinho, Lista_Desejos, ItemPedido, Pedido

class ItemPedidoInline(admin.TabularInline):
    model = ItemPedido
    extra = 1

# Não é necessário o PedidoInline, pois não quero associar os pedidos diretamente ao Perfil nesse caso
# Cada Pedido vai ser associado ao Perfil, mas não diretamente no PerfilAdmin

class ListaDesejosInline(admin.TabularInline):
    model = Lista_Desejos
    extra = 1

class ItemCarrinhoInline(admin.TabularInline):
    model = Item_carrinho
    extra = 1

class PerfilAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'carteira')
    inlines = [ItemCarrinhoInline, ListaDesejosInline]  


class PedidoAdmin(admin.ModelAdmin):
    inlines = [ItemPedidoInline]  

# Registrar os modelos no admin
admin.site.register(Perfil, PerfilAdmin)
admin.site.register(Pedido, PedidoAdmin)  
