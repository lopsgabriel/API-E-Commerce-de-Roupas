from django.contrib import admin
from .models import Categoria, Produto

class Categorias(admin.ModelAdmin):
    list_display = ('nome', 'descricao')
    list_display_links = ('nome',)
    list_per_page = 10
    search_fields = ('nome',)
    ordering = ('nome',)
admin.site.register(Categoria, Categorias)

class Produtos(admin.ModelAdmin):
    list_display = ('nome', 'preco', 'estoque', 'categoria')
    list_display_links = ('nome', 'preco')
    list_per_page = 10
    search_fields = ('nome', 'categoria')
    ordering = ('nome',)
admin.site.register(Produto, Produtos)