from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from perfil.views import PerfilViewSet,ItemCarrinhoViewSet
from roupas.views import CategoriaViewSet, ProdutoViewSet
from rest_framework_simplejwt.views import TokenObtainPairView
from django.conf import settings
from django.conf.urls.static import static

router = routers.DefaultRouter()
router.register('categorias', CategoriaViewSet, basename='Categorias')
router.register('produtos', ProdutoViewSet, basename='Produtos')
router.register('perfis', PerfilViewSet, basename='Perfis')
#futuramente retirar rota carrinhos
router.register('carrinhos', ItemCarrinhoViewSet, basename='Carrinhos')
urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include(router.urls)),
    path('roupas/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
