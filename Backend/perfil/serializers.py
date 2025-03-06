from rest_framework import serializers
from .models import Perfil, Item_carrinho, Lista_Desejos, ItemPedido, Pedido
from roupas.models import Produto
from django.contrib.auth.models import User


class ItemCarrinhoSerializer(serializers.ModelSerializer):
    produto = serializers.PrimaryKeyRelatedField(queryset=Produto.objects.all())  # Usando o ID para criar
    perfil_carrinho = serializers.PrimaryKeyRelatedField(queryset=Perfil.objects.all())  # Usando o ID para criar

    produto_nome = serializers.StringRelatedField(source='produto')
    usuario_nome = serializers.StringRelatedField(source='perfil_carrinho')


    class Meta:
        model = Item_carrinho
        fields = ['id', 'perfil_carrinho', 'usuario_nome', 'produto', 'produto_nome', 'quantidade']

class ListaDesejosSerializer(serializers.ModelSerializer):
    produto = serializers.PrimaryKeyRelatedField(queryset=Produto.objects.all())  # Usando o ID para criar
    usuario = serializers.PrimaryKeyRelatedField(queryset=Perfil.objects.all())  # Usando o ID para criar

    # Usando StringRelatedField para mostrar o nome do produto e do usuário nas respostas
    produto_nome = serializers.StringRelatedField(source='produto')
    usuario_nome = serializers.StringRelatedField(source='usuario')

    class Meta:
        model = Lista_Desejos
        fields = [ 'usuario', 'usuario_nome', 'produto', 'produto_nome']



class PerfilSerializer(serializers.ModelSerializer):
    usuario = serializers.ReadOnlyField(source='usuario.username')
    carrinho = ItemCarrinhoSerializer(source='Item_carrinho', many=True, read_only=True)
    wishlist = ListaDesejosSerializer(source='lista_desejos', many=True, read_only=True)
    class Meta: 
        model = Perfil
        fields = ['id', 'usuario', 'carteira', 'carrinho', 'wishlist']

class ListaCarrinhoSerializer(serializers.ModelSerializer):
    produto = serializers.StringRelatedField()
    class Meta:
        model = Item_carrinho
        fields = ['id', 'produto', 'preco', 'quantidade']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
    
class ItemPedidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemPedido
        fields = ['produto', 'quantidade', 'preco']

class PedidoSerializer(serializers.ModelSerializer):
    itens = ItemPedidoSerializer(many=True)  # Relacionando os itens no pedido

    class Meta:
        model = Pedido
        fields = ['id', 'usuario', 'itens', 'data_criacao', 'status']

    def create(self, validated_data):
        itens_data = validated_data.pop('itens')  # Extraindo os itens
        pedido = Pedido.objects.create(**validated_data)
        
        for item_data in itens_data:
            ItemPedido.objects.create(pedido=pedido, **item_data)  # Criando os itens e associando ao pedido
        
        return pedido

    

