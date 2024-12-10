from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from perfil.views import PerfilViewSet,ItemCarrinhoViewSet, ListaCarrinhoViewSet, ListaDesejosViewSet, UserCreateView
from roupas.views import CategoriaViewSet, ProdutoViewSet, CategoriaProdutosViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static

router = routers.DefaultRouter()
router.register('categorias', CategoriaViewSet, basename='Categorias')
router.register('produtos', ProdutoViewSet, basename='Produtos')
router.register('perfis', PerfilViewSet, basename='Perfis')
router.register('carrinhos', ItemCarrinhoViewSet, basename='Carrinhos')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include(router.urls)),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('carrinhos/perfil/<str:usuario>/', ListaCarrinhoViewSet.as_view(), name='Carrinho'),
    path('categorias/<str:categoria>', CategoriaProdutosViewSet.as_view({'get': 'list'}), name='Categorias'),
    path('listaDesejos/<int:usuario>/<int:item_id>/', ListaDesejosViewSet.as_view({'get': 'retrieve', 'delete': 'destroy'}), name='ListaDesejosItem'),
    path('listaDesejos/<int:usuario>/', ListaDesejosViewSet.as_view({'get': 'list', 'post': 'create'}), name='ListaDesejosUsuario'),
    path('register/', UserCreateView.as_view(), name='user-register'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
