from django.contrib import admin
from .models import Perfil, Item_carrinho, Lista_Desejos

class ListaDesejosInline(admin.TabularInline):
    model = Lista_Desejos
    extra = 1

class  ItemCarrinhoInline(admin.TabularInline):
    model = Item_carrinho
    extra = 1

class PerfilAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'carteira')
    inlines = [ItemCarrinhoInline, ListaDesejosInline]

admin.site.register(Perfil, PerfilAdmin)


