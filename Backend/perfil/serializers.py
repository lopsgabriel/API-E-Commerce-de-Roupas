from rest_framework import serializers
from .models import Perfil, Item_carrinho, Lista_Desejos
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

