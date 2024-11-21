from rest_framework.authentication import BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from .serializers import PerfilSerializer, ItemCarrinhoSerializer
from .models import Perfil, Item_carrinho
from rest_framework import viewsets, filters
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