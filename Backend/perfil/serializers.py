from rest_framework import serializers
from .models import Perfil, Item_carrinho, Lista_Desejos, ItemPedido, Pedido
from roupas.models import Produto
from django.contrib.auth.models import User

class ItemCarrinhoSerializer(serializers.ModelSerializer):
    """
    Serializer para os itens no carrinho de compras.
    Serializa e desserializa os dados de um item do carrinho.
    """
    produto = serializers.PrimaryKeyRelatedField(queryset=Produto.objects.all())  # Usando o ID para criar
    usuario = serializers.PrimaryKeyRelatedField(queryset=Perfil.objects.all())  # Usando o ID para criar

    produto_nome = serializers.StringRelatedField(source='produto')  # Exibe o nome do produto
    usuario_nome = serializers.StringRelatedField(source='usuario')  # Exibe o nome do usuário

    class Meta:
        model = Item_carrinho
        fields = ['id', 'usuario', 'usuario_nome', 'produto', 'produto_nome', 'quantidade']


class ListaDesejosSerializer(serializers.ModelSerializer):
    """
    Serializer para a lista de desejos de um usuário.
    Serializa e desserializa os dados de um item da lista de desejos.
    """
    produto = serializers.PrimaryKeyRelatedField(queryset=Produto.objects.all())  # Usando o ID para criar
    usuario = serializers.PrimaryKeyRelatedField(queryset=Perfil.objects.all())  # Usando o ID para criar

    # Exibe o nome do produto e do usuário nas respostas
    produto_nome = serializers.StringRelatedField(source='produto')
    usuario_nome = serializers.StringRelatedField(source='usuario')

    class Meta:
        model = Lista_Desejos
        fields = ['usuario', 'usuario_nome', 'produto', 'produto_nome']


class PerfilSerializer(serializers.ModelSerializer):
    """
    Serializer para o perfil de um usuário.
    Serializa e desserializa os dados do perfil, incluindo informações do carrinho e lista de desejos.
    """
    usuario = serializers.ReadOnlyField(source='usuario.username')  # Nome de usuário
    usuario_id = serializers.ReadOnlyField(source='usuario.id')  # ID do usuário
    admin = serializers.SerializerMethodField()  # Verifica se o usuário é admin
    carrinho = ItemCarrinhoSerializer(source='Item_carrinho', many=True, read_only=True)  # Itens do carrinho
    wishlist = ListaDesejosSerializer(source='lista_desejos', many=True, read_only=True)  # Lista de desejos

    class Meta:
        model = Perfil
        fields = ['id', 'usuario', 'usuario_id', 'admin', 'carteira', 'carrinho', 'wishlist']
    
    def get_admin(self, obj):
        """
        Retorna True se o usuário for administrador (superuser ou staff).
        """
        return obj.usuario.is_superuser or obj.usuario.is_staff


class ListaCarrinhoSerializer(serializers.ModelSerializer):
    """
    Serializer para exibir itens do carrinho com nome do produto e quantidade.
    """
    produto = serializers.StringRelatedField()  # Exibe o nome do produto

    class Meta:
        model = Item_carrinho
        fields = ['id', 'produto', 'preco', 'quantidade']


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer para criar um usuário.
    Serializa e desserializa os dados de um usuário.
    """
    class Meta:
        model = User
        fields = ['id', 'username', 'password']
        extra_kwargs = {'password': {'write_only': True}}  # A senha deve ser escrita, mas não lida

    def create(self, validated_data):
        """
        Cria um usuário com a senha criptografada.
        """
        user = User.objects.create_user(**validated_data)
        return user


class ItemPedidoSerializer(serializers.ModelSerializer):
    """
    Serializer para os itens dentro de um pedido.
    Serializa e desserializa os dados de um item de pedido.
    """
    class Meta:
        model = ItemPedido
        fields = ['produto', 'quantidade', 'preco']


class PedidoSerializer(serializers.ModelSerializer):
    """
    Serializer para um pedido realizado por um usuário.
    Serializa e desserializa os dados do pedido, incluindo os itens do pedido.
    """
    itens = ItemPedidoSerializer(many=True)  # Relacionando os itens no pedido

    class Meta:
        model = Pedido
        fields = ['id', 'usuario', 'itens', 'data_criacao', 'status']

    def create(self, validated_data):
        """
        Cria um pedido e seus itens associados.
        """
        itens_data = validated_data.pop('itens')  # Obtém os itens do pedido
        pedido = Pedido.objects.create(**validated_data)  # Cria o pedido
        
        # Cria os itens do pedido e associa ao pedido
        for item_data in itens_data:
            ItemPedido.objects.create(pedido=pedido, **item_data)
        
        return pedido
