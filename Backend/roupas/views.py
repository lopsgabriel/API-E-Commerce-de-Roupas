from rest_framework.authentication import BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from .models import Categoria, Produto
from .serializers import CategoriaSerializer, ProdutoSerializer
from rest_framework import viewsets, filters, status
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.response import Response

class CategoriaViewSet(viewsets.ModelViewSet):
    # permission_classes = [IsAuthenticated]
    queryset = Categoria.objects.all().order_by('nome')
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    ordering_fields = ['nome']
    search_fields = ['nome']
    serializer_class = CategoriaSerializer

class ProdutoViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Produto.objects.all().order_by('categoria')
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    ordering_fields = ['nome', 'preco']
    search_fields = ['nome', 'preco', 'categoria__nome']
    serializer_class = ProdutoSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, context={'request': request})
        return Response(serializer.data)
    
    def update(self, request, pk=None):
        produto = Produto.objects.get(id=pk)
        serializer = ProdutoSerializer(produto, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CategoriaProdutosViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ProdutoSerializer

    def get_queryset(self):
        categoria = self.kwargs['categoria']
        return Produto.objects.filter(categoria__nome=categoria)
    