from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from roupas.views import CategoriaViewSet, ProdutoViewSet

router = routers.DefaultRouter()
router.register('categorias', CategoriaViewSet, basename='Categorias')
router.register('produtos', ProdutoViewSet, basename='Produtos')
urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include(router.urls)),
    # path('api-auth/', include('rest_framework.urls')),
]
