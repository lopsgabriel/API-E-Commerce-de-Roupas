from rest_framework import serializers
from .models import Perfil, Item_carrinho
from roupas.models import Produto

class ItemCarrinhoSerializer(serializers.ModelSerializer):
    produto = serializers.StringRelatedField()
    perfil_carrinho = serializers.StringRelatedField()
    #futuramente retirar o perfil carrinho e o id
    class Meta:
        model = Item_carrinho
        fields = ['id', 'perfil_carrinho', 'produto', 'quantidade']

class PerfilSerializer(serializers.ModelSerializer):
    usuario = serializers.ReadOnlyField(source='usuario.username')
    carrinho = ItemCarrinhoSerializer(source='Item_carrinho', many=True, read_only=True)
    class Meta: 
        model = Perfil
        fields = ['id', 'usuario', 'carteira', 'carrinho']

