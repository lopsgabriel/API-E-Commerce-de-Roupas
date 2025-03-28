from rest_framework import serializers
from .models import Categoria, Produto

class CategoriaSerializer(serializers.ModelSerializer):
    """
    Serializer para a categoria de produtos.
    Serializa e desserializa os dados de uma categoria.
    """
    class Meta:
        model = Categoria
        fields = '__all__'


class ProdutoSerializer(serializers.ModelSerializer):
    """
    Serializer para os produtos de roupas.
    Serializa e desserializa os dados de um produto, incluindo a URL da imagem, se houver.
    """
    class Meta:
        model = Produto
        fields = '__all__'

    def to_representation(self, instance):
        """
        Modifica a representação do produto para incluir a URL completa da imagem.
        """
        data = super().to_representation(instance)
        request = self.context.get('request')  # Obtém o request do contexto
        if request and instance.imagem:
            # Se houver uma imagem, adiciona a URL completa da imagem ao campo 'imagem'
            data['imagem'] = request.build_absolute_uri(instance.imagem.url)
        return data
