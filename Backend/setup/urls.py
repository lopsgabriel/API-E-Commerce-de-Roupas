from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from perfil.views import PerfilViewSet,ItemCarrinhoViewSet, listaCarrinhoViewSet
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
    path('carrinhos/perfil/<str:usuario>/', listaCarrinhoViewSet.as_view(), name='Carrinho'),
    path('categorias/<str:categoria>', CategoriaProdutosViewSet.as_view({'get': 'list'}), name='Categorias')
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
