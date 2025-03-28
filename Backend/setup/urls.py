from django.urls import path, include
from django.contrib.auth.models import User, Group
from django.contrib import admin
from rest_framework import routers
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static

# Importação das views
from perfil.views import PerfilViewSet, ItemCarrinhoViewSet, ListaDesejosViewSet, UserCreateView, PedidoViewSet
from roupas.views import CategoriaViewSet, ProdutoViewSet, CategoriaProdutosViewSet

# Inicialização do roteador padrão
router = routers.DefaultRouter()
router.register('categorias', CategoriaViewSet, basename='Categorias')
router.register('produtos', ProdutoViewSet, basename='Produtos')
router.register('perfis', PerfilViewSet, basename='Perfis')

# Definição das rotas
urlpatterns = [
    path('admin/', admin.site.urls),  # Rota para o painel de administração
    path('', include(router.urls)),  # Inclui as rotas definidas no roteador
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  # Endpoint para obtenção do token JWT
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # Endpoint para atualização do token JWT
    path('produto/<int:pk>', ProdutoViewSet.as_view({'get': 'retrieve', 'put':'update'}), name='Produto'),  # Detalhes e edição de produtos
    path('categorias/<str:categoria>', CategoriaProdutosViewSet.as_view({'get': 'list'}), name='Categorias'),  # Lista produtos por categoria
    path('carrinhos/<int:usuario>/<int:item_id>/', ItemCarrinhoViewSet.as_view({'get': 'retrieve', 'delete': 'destroy', 'put': 'update'}), name='CarrinhoItem'),  # Manipulação de itens no carrinho
    path('carrinhos/<int:usuario>/', ItemCarrinhoViewSet.as_view({'get': 'list', 'post': 'create', 'put': 'update'}), name='CarrinhoUsuario'),  # Visualização e adição de itens no carrinho do usuário
    path('listaDesejos/<int:usuario>/<int:item_id>/', ListaDesejosViewSet.as_view({'get': 'retrieve', 'delete': 'destroy'}), name='ListaDesejosItem'),  # Manipulação de itens na lista de desejos
    path('listaDesejos/<int:usuario>/', ListaDesejosViewSet.as_view({'get': 'list', 'post': 'create'}), name='ListaDesejosUsuario'),  # Visualização e adição de itens na lista de desejos
    path('pedidos/<int:usuario>/', PedidoViewSet.as_view({'get': 'list', 'post': 'create'}), name='PedidosUsuario'),  # Visualização e criação de pedidos
    path('register/', UserCreateView.as_view(), name='user-register'),  # Endpoint para registro de usuários
]

# Adiciona configuração de arquivos estáticos e mídia em modo de depuração
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
