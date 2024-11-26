from rest_framework.authentication import BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from .serializers import PerfilSerializer, ItemCarrinhoSerializer, ListaCarrinhoSerializer
from .models import Perfil, Item_carrinho
from rest_framework import viewsets, filters, generics
from django_filters.rest_framework import DjangoFilterBackend


class PerfilViewSet(viewsets.ModelViewSet):
    authentication_classes = [ BasicAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Perfil.objects.all().order_by('usuario')
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    serializer_class = PerfilSerializer


#futuramente retirar o itemcarrinhoviewset
class ItemCarrinhoViewSet(viewsets.ModelViewSet):
    authentication_classes = [ BasicAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Item_carrinho.objects.all().order_by('produto')
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    serializer_class = ItemCarrinhoSerializer

class listaCarrinhoViewSet(generics.ListAPIView):
    serializer_class = ListaCarrinhoSerializer
    
    def get_queryset(self):
        usuario = self.kwargs['usuario']  #Pega o nome do usuario pela url
        try:
            #Busca o perfil pelo usuario passado na url
            perfil = Perfil.objects.get(usuario__username=usuario)
            #Retorna os itens do carrinho associado ao usuario
            return Item_carrinho.objects.filter(perfil_carrinho=perfil)
        except Perfil.DoesNotExist:
            #Se o perfil não for encontrado, retorna uma queryset vazia
            return Item_carrinho.objects.none()