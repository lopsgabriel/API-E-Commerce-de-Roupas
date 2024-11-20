from django.contrib import admin
from .models import Perfil, Item_carrinho

class  ItemCarrinhoInline(admin.TabularInline):
    model = Item_carrinho
    extra = 1

class PerfilAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'carteira')
    inlines = [ItemCarrinhoInline]

admin.site.register(Perfil, PerfilAdmin)

