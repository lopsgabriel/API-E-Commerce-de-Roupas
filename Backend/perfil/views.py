from rest_framework.authentication import BasicAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import PerfilSerializer, ItemCarrinhoSerializer, ListaCarrinhoSerializer, ListaDesejosSerializer, UserSerializer, ItemPedidoSerializer, PedidoSerializer
from .models import Perfil, Item_carrinho, Lista_Desejos, ItemPedido, Pedido
from rest_framework import viewsets, filters, generics, status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from django.contrib.auth.models import User

class PerfilViewSet(viewsets.ModelViewSet):
    """
    ViewSet para o modelo 'Perfil'.
    Permite listar, criar, editar e excluir perfis.
    """
    queryset = Perfil.objects.all().order_by('usuario')
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    serializer_class = PerfilSerializer

    def get_queryset(self):
        """
        Retorna o perfil do usuário autenticado ou filtra pelo ID do usuário.
        """
        user_id = self.request.query_params.get('usuario_id')
        if user_id is not None:
            return Perfil.objects.filter(usuario__id=user_id)
        return Perfil.objects.all()  # Retorna todos os perfis se o parâmetro não for fornecido

class ItemCarrinhoViewSet(viewsets.ModelViewSet):
    """
    ViewSet para os itens do carrinho de compras.
    Permite listar, criar, editar e excluir itens do carrinho de um perfil.
    """
    permission_classes = [IsAuthenticated]
    queryset = Item_carrinho.objects.all().order_by('produto')
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    ordering_fields = ['produto']
    search_fields = ['produto__nome']
    serializer_class = ItemCarrinhoSerializer

    def list(self, request, usuario=None):
        """
        Lista os itens do carrinho de compras para um perfil específico.
        """
        try:
            perfil = Perfil.objects.get(id=usuario)
            itens_carrinho = Item_carrinho.objects.filter(usuario=perfil)
            serializer = ItemCarrinhoSerializer(itens_carrinho, many=True)
            return Response(serializer.data)
        except Perfil.DoesNotExist:
            return Response({"detail": "Perfil não encontrado."}, status=status.HTTP_404_NOT_FOUND)

    def retrieve(self, request, usuario=None, item_id=None):
        """
        Retorna um item específico do carrinho de compras para um perfil específico.
        """
        try:
            perfil = Perfil.objects.get(id=usuario)
            item_carrinho = Item_carrinho.objects.get(usuario=perfil, produto__id=item_id)
            serializer = ItemCarrinhoSerializer(item_carrinho)
            return Response(serializer.data)
        except Perfil.DoesNotExist:
            return Response({"detail": "Perfil não encontrado."}, status=status.HTTP_404_NOT_FOUND)
        except Item_carrinho.DoesNotExist:
            return Response({"detail": "Item de carrinho não encontrado."}, status=status.HTTP_404_NOT_FOUND)

    def destroy(self, request, usuario=None, item_id=None):
        """
        Exclui um item do carrinho de compras de um perfil específico.
        """
        try:
            perfil = Perfil.objects.get(id=usuario)
            item_carrinho = Item_carrinho.objects.get(usuario=perfil, produto__id=item_id)
            item_carrinho.delete()
            return Response({"detail": "Item de carrinho excluído com sucesso."}, status=status.HTTP_204_NO_CONTENT)
        except Perfil.DoesNotExist:
            return Response({"detail": "Perfil não encontrado."}, status=status.HTTP_404_NOT_FOUND)
        except Item_carrinho.DoesNotExist:
            return Response({"detail": "Item de carrinho não encontrado."}, status=status.HTTP_404_NOT_FOUND)

    def create(self, request, usuario=None):
        """
        Cria um novo item no carrinho de compras para um perfil específico.
        """
        try:
            perfil = Perfil.objects.get(id=usuario)
            serializer = ItemCarrinhoSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(usuario=perfil)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Perfil.DoesNotExist:
            return Response({"detail": "Perfil não encontrado."}, status=status.HTTP_404_NOT_FOUND)

    def update(self, request, usuario=None, item_id=None):
        """
        Atualiza um item do carrinho de compras para um perfil específico.
        """
        try:
            perfil = Perfil.objects.get(id=usuario)
            item_carrinho = Item_carrinho.objects.get(usuario=perfil, produto__id=item_id)
            serializer = ItemCarrinhoSerializer(item_carrinho, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Perfil.DoesNotExist:
            return Response({"detail": "Perfil não encontrado."}, status=status.HTTP_404_NOT_FOUND)

class ListaDesejosViewSet(viewsets.ViewSet):
    """
    ViewSet para a lista de desejos de um perfil.
    Permite listar, criar, editar e excluir itens na lista de desejos.
    """

    def list(self, request, usuario=None):
        """
        Lista os itens de desejo para um perfil específico.
        """
        try:
            perfil = Perfil.objects.get(id=usuario)
            itens_desejo = Lista_Desejos.objects.filter(usuario=perfil)
            serializer = ListaDesejosSerializer(itens_desejo, many=True)
            return Response(serializer.data)
        except Perfil.DoesNotExist:
            return Response({"detail": "Perfil não encontrado."}, status=status.HTTP_404_NOT_FOUND)

    def retrieve(self, request, usuario=None, item_id=None):
        """
        Retorna um item específico da lista de desejos para um perfil.
        """
        try:
            perfil = Perfil.objects.get(id=usuario)
            item_desejo = Lista_Desejos.objects.get(usuario=perfil, produto__id=item_id)
            serializer = ListaDesejosSerializer(item_desejo)
            return Response(serializer.data)
        except Perfil.DoesNotExist:
            return Response({"detail": "Perfil não encontrado."}, status=status.HTTP_404_NOT_FOUND)
        except Lista_Desejos.DoesNotExist:
            return Response({"detail": "Item não encontrado."}, status=status.HTTP_404_NOT_FOUND)

    def destroy(self, request, usuario=None, item_id=None):
        """
        Exclui um item da lista de desejos de um perfil.
        """
        try:
            perfil = Perfil.objects.get(id=usuario)
            item_wishlist = Lista_Desejos.objects.get(usuario=perfil, produto__id=item_id)
            item_wishlist.delete()
            return Response({"detail": "Item deletado com sucesso."}, status=status.HTTP_204_NO_CONTENT)
        except Perfil.DoesNotExist:
            return Response({"detail": "Perfil não encontrado."}, status=status.HTTP_404_NOT_FOUND)
        except Lista_Desejos.DoesNotExist:
            return Response({"detail": "Item não encontrado."}, status=status.HTTP_404_NOT_FOUND)

    def create(self, request, usuario=None):
        """
        Cria um novo item na lista de desejos para um perfil específico.
        """
        try:
            perfil = Perfil.objects.get(id=usuario)
            serializer = ListaDesejosSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(usuario=perfil)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Perfil.DoesNotExist:
            return Response({"detail": "Perfil não encontrado."}, status=status.HTTP_404_NOT_FOUND)

class ListaCarrinhoViewSet(generics.ListAPIView):
    """
    View para listar todos os itens no carrinho de um perfil específico.
    """
    serializer_class = ListaCarrinhoSerializer

    def get_queryset(self):
        """
        Retorna todos os itens no carrinho de compras de um perfil.
        """
        usuario = self.kwargs['usuario']
        try:
            perfil = Perfil.objects.get(id=usuario)
            return Item_carrinho.objects.filter(usuario=perfil)
        except Perfil.DoesNotExist:
            return Item_carrinho.objects.none()

class PedidoViewSet(viewsets.ModelViewSet):
    """
    ViewSet para os pedidos de um perfil.
    Permite listar, criar, editar e excluir pedidos.
    """
    queryset = Pedido.objects.all().order_by('id')
    serializer_class = PedidoSerializer

    def list(self, request, usuario=None):
        """
        Lista os pedidos de um perfil específico.
        """
        try:
            perfil = Perfil.objects.get(id=usuario)
            pedidos = Pedido.objects.filter(usuario=perfil)
            serializer = PedidoSerializer(pedidos, many=True)
            return Response(serializer.data)
        except Perfil.DoesNotExist:
            return Response({"detail": "Perfil não encontrado."}, status=status.HTTP_404_NOT_FOUND)

    def create(self, request, usuario=None):
        """
        Cria um novo pedido para um perfil específico.
        """
        try:
            perfil = Perfil.objects.get(id=usuario)
            pedido_serializer = PedidoSerializer(data=request.data)
            if pedido_serializer.is_valid():
                pedido = pedido_serializer.save(usuario=perfil)
                pedido_completo = PedidoSerializer(pedido)
                return Response(pedido_completo.data, status=status.HTTP_201_CREATED)
            return Response(pedido_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Perfil.DoesNotExist:
            return Response({"detail": "Perfil não encontrado."}, status=status.HTTP_404_NOT_FOUND)

    def retrieve(self, request, usuario=None, pk=None):
        """
        Retorna um pedido específico para um perfil.
        """
        try:
            perfil = Perfil.objects.get(id=usuario)
            pedido = Pedido.objects.get(id=pk, usuario=perfil)
            serializer = PedidoSerializer(pedido)
            return Response(serializer.data)
        except Perfil.DoesNotExist:
            return Response({"detail": "Perfil não encontrado."}, status=status.HTTP_404_NOT_FOUND)
        except Pedido.DoesNotExist:
            return Response({"detail": "Pedido não encontrado."}, status=status.HTTP_404_NOT_FOUND)

    def update(self, request, usuario=None, pk=None):
        """
        Atualiza um pedido específico para um perfil.
        """
        try:
            perfil = Perfil.objects.get(id=usuario)
            pedido = Pedido.objects.get(id=pk, usuario=perfil)
            serializer = PedidoSerializer(pedido, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Perfil.DoesNotExist:
            return Response({"detail": "Perfil não encontrado."}, status=status.HTTP_404_NOT_FOUND)
        except Pedido.DoesNotExist:
            return Response({"detail": "Pedido não encontrado."}, status=status.HTTP_404_NOT_FOUND)


        # Excluindo um pedido
    def destroy(self, request, usuario=None, pk=None):
        """
        Exclui um pedido específico de um perfil.
        """
        try:
            perfil = Perfil.objects.get(id=usuario)
            pedido = Pedido.objects.get(id=pk, usuario=perfil)
            pedido.delete()
            return Response({"detail": "Pedido excluído com sucesso."}, status=status.HTTP_204_NO_CONTENT)
        except Perfil.DoesNotExist:
            return Response({"detail": "Perfil não encontrado."}, status=status.HTTP_404_NOT_FOUND)
        except Pedido.DoesNotExist:
            return Response({"detail": "Pedido não encontrado."}, status=status.HTTP_404_NOT_FOUND)

class UserCreateView(generics.CreateAPIView):
    """
    View para criar um novo usuário.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
