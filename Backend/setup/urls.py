from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from roupas.views import CategoriaViewSet, ProdutoViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = routers.DefaultRouter()
router.register('categorias', CategoriaViewSet, basename='Categorias')
router.register('produtos', ProdutoViewSet, basename='Produtos')
urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include(router.urls)),
    path('roupas/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
]
