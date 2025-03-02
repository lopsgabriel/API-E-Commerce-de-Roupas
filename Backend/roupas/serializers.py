from rest_framework import serializers
from .models import Categoria, Produto

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'

class ProdutoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Produto
        fields = '__all__'

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get('request')  # Obtém o request do contexto
        if request and instance.imagem:
            data['imagem'] = request.build_absolute_uri(instance.imagem.url)
        return data