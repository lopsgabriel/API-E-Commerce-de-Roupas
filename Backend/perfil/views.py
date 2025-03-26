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
    # permission_classes = [IsAuthenticated]
    queryset = Perfil.objects.all().order_by('usuario')
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    serializer_class = PerfilSerializer

    def get_queryset(self):
        """
        Retorna o perfil do usuário autenticado.
        """
        user_id = self.request.query_params.get('usuario_id')
        if user_id is not None:
            # Filtra pelo username do usuário no campo 'usuario' que é uma chave estrangeira para User
            return Perfil.objects.filter(usuario__id=user_id)
        return Perfil.objects.all()  # Retorna todos os perfis se o parâmetro não for fornecido

class ItemCarrinhoViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Item_carrinho.objects.all().order_by('produto')
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    ordering_fields = ['produto']
    search_fields = ['produto__nome']
    serializer_class = ItemCarrinhoSerializer

    def list(self, request, usuario=None):
        try:
            # Busca o perfil pelo ID (usuario é o ID do perfil na URL)
            perfil = Perfil.objects.get(id=usuario)  

            # Retorna todos os itens de carrinho associados a esse perfil
            itens_carrinho = Item_carrinho.objects.filter(usuario=perfil)
            serializer = ItemCarrinhoSerializer(itens_carrinho, many=True)

            return Response(serializer.data)

        except Perfil.DoesNotExist:
            return Response({"detail": "Perfil não encontrado."}, status=status.HTTP_404_NOT_FOUND)
    

    def retrieve(self, request, usuario=None, item_id=None):
        try:
            perfil = Perfil.objects.get(id=usuario)  

            # Pega o item  com base no perfil e no ID do item
            item_carrinho = Item_carrinho.objects.get(usuario=perfil, produto__id=item_id)
            serializer = ItemCarrinhoSerializer(item_carrinho)

            return Response(serializer.data)

        except Perfil.DoesNotExist:
            return Response({"detail": "Perfil não encontrado."}, status=status.HTTP_404_NOT_FOUND)

        except Item_carrinho.DoesNotExist:
            return Response({"detail": "Item de carrinho não encontrado."}, status=status.HTTP_404_NOT_FOUND)
        

    def destroy(self, request, usuario=None, item_id=None):
        try:
            # Busca o perfil pelo ID (usuario é o ID do perfil na URL)
            perfil = Perfil.objects.get(id=usuario)  

            # Pega o item  com base no perfil e no ID do item    
            item_carrinho = Item_carrinho.objects.get(usuario=perfil, produto__id=item_id)
            item_carrinho.delete()

            return Response({"detail": "Item de carrinho excluído com sucesso."}, status=status.HTTP_204_NO_CONTENT)

        except Perfil.DoesNotExist:
            return Response({"detail": "Perfil não encontrado."}, status=status.HTTP_404_NOT_FOUND)

        except Item_carrinho.DoesNotExist:
            return Response({"detail": "Item de carrinho não encontrado."}, status=status.HTTP_404_NOT_FOUND)
    
    def create(self, request, usuario=None):
        try:
            # Busca o perfil pelo ID (usuario é o ID do perfil na URL)
            perfil = Perfil.objects.get(id=usuario)  

            # Cria o novo item no carrinho com os dados enviados    
            serializer = ItemCarrinhoSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(usuario=perfil)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Perfil.DoesNotExist:
            return Response({"detail": "Perfil não encontrado."}, status=status.HTTP_404_NOT_FOUND)
    
    def update(self, request, usuario=None, item_id=None):
        try:
            # Busca o perfil pelo ID (usuario é o ID do perfil na URL)
            perfil = Perfil.objects.get(id=usuario)  

            # Pega o item  com base no perfil e no ID do item    
            item_carrinho = Item_carrinho.objects.get(usuario=perfil, produto__id=item_id)
            serializer = ItemCarrinhoSerializer(item_carrinho, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Perfil.DoesNotExist:
            return Response({"detail": "Perfil não encontrado."}, status=status.HTTP_404_NOT_FOUND)


class ListaDesejosViewSet(viewsets.ViewSet):

    def list(self, request, usuario=None):
        try:
            # Busca o perfil pelo ID (usuario é o ID do perfil na URL)
            perfil = Perfil.objects.get(id=usuario)  

            # Retorna todos os itens de desejo associados a esse perfil
            itens_desejo = Lista_Desejos.objects.filter(usuario=perfil)
            serializer = ListaDesejosSerializer(itens_desejo, many=True)

            return Response(serializer.data)

        except Perfil.DoesNotExist:
            return Response({"detail": "Perfil não encontrado."}, status=status.HTTP_404_NOT_FOUND)

    def retrieve(self, request, usuario=None, item_id=None):
        try:
            perfil = Perfil.objects.get(id=usuario)  

            # Pega o item  com base no perfil e no ID do item
            item_desejo = Lista_Desejos.objects.get(usuario=perfil, produto__id=item_id)
            serializer = ListaDesejosSerializer(item_desejo)

            return Response(serializer.data)

        except Perfil.DoesNotExist:
            return Response({"detail": "Perfil não encontrado."}, status=status.HTTP_404_NOT_FOUND)

        except Lista_Desejos.DoesNotExist:
            return Response({"detail": "Item não encontrado."}, status=status.HTTP_404_NOT_FOUND)

    def destroy(self, request, usuario=None, item_id=None):
        try:
            perfil = Perfil.objects.get(id=usuario)  # Usa 'id' ao invés de 'usuario'

            # Pega o item  com base no perfil e no ID do item
            item_wishlist = Lista_Desejos.objects.get(usuario=perfil, produto__id=item_id)
            item_wishlist.delete()

            return Response({"detail": "Item deletado com sucesso."}, status=status.HTTP_204_NO_CONTENT)

        except Perfil.DoesNotExist:
            return Response({"detail": "Perfil não encontrado."}, status=status.HTTP_404_NOT_FOUND)

        except Lista_Desejos.DoesNotExist:
            return Response({"detail": "Item não encontrado."}, status=status.HTTP_404_NOT_FOUND)
        
    def create(self, request, usuario=None):
        try:
            perfil = Perfil.objects.get(id=usuario)  # Pega perfil do usuário pelo ID

            # Cria o novo item na wishlist com os dados enviados 
            serializer = ListaDesejosSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(usuario=perfil)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        except Perfil.DoesNotExist:
            return Response({"detail": "Perfil não encontrado."}, status=status.HTTP_404_NOT_FOUND)

class ListaCarrinhoViewSet(generics.ListAPIView):
    serializer_class = ListaCarrinhoSerializer
    
    def get_queryset(self):
        usuario = self.kwargs['usuario']  #Pega o nome do usuario pela url
        try:
            #Busca o perfil pelo usuario passado na url
            perfil = Perfil.objects.get(id=usuario)

            #Retorna os itens do carrinho associado ao usuario
            return Item_carrinho.objects.filter(usuario=perfil)
        except Perfil.DoesNotExist:
            #Se o perfil não for encontrado, retorna uma queryset vazia
            return Item_carrinho.objects.none()
        
class PedidoViewSet(viewsets.ModelViewSet):
    queryset = Pedido.objects.all().order_by('id')  # Ordem de pedidos por ID
    serializer_class = PedidoSerializer

    
    # Listando pedidos de um usuário
    def list(self, request, usuario=None):
        try:
            perfil = Perfil.objects.get(id=usuario)
            pedidos = Pedido.objects.filter(usuario=perfil)
            serializer = PedidoSerializer(pedidos, many=True)
            return Response(serializer.data)
        except Perfil.DoesNotExist:
            return Response({"detail": "Perfil não encontrado."}, status=status.HTTP_404_NOT_FOUND)

    # Criando um novo pedido
    def create(self, request, usuario=None):
        try:
            perfil = Perfil.objects.get(id=usuario)

            # Serializa e salva o pedido + itens (delega isso para o serializer)
            pedido_serializer = PedidoSerializer(data=request.data)
            if pedido_serializer.is_valid():
                pedido = pedido_serializer.save(usuario=perfil)
                
                # Serializa novamente o pedido com os itens incluídos
                pedido_completo = PedidoSerializer(pedido)
                return Response(pedido_completo.data, status=status.HTTP_201_CREATED)

            return Response(pedido_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        except Perfil.DoesNotExist:
            return Response({"detail": "Perfil não encontrado."}, status=status.HTTP_404_NOT_FOUND)
    
    # Detalhando um pedido (mostrar um pedido específico)
    def retrieve(self, request, usuario=None, pk=None):
        try:
            perfil = Perfil.objects.get(id=usuario)
            pedido = Pedido.objects.get(id=pk, usuario=perfil)
            serializer = PedidoSerializer(pedido)
            return Response(serializer.data)
        except Perfil.DoesNotExist:
            return Response({"detail": "Perfil não encontrado."}, status=status.HTTP_404_NOT_FOUND)
        except Pedido.DoesNotExist:
            return Response({"detail": "Pedido não encontrado."}, status=status.HTTP_404_NOT_FOUND)

    # Atualizando um pedido
    def update(self, request, usuario=None, pk=None):
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
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]