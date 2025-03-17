from django.urls import path, include
from django.contrib.auth.models import User, Group
from django.contrib import admin
admin.autodiscover()
from rest_framework import routers, generics, serializers, permissions 
from perfil.views import PerfilViewSet,ItemCarrinhoViewSet, ListaDesejosViewSet, UserCreateView, PedidoViewSet, GitHubAccessTokenView
from roupas.views import CategoriaViewSet, ProdutoViewSet, CategoriaProdutosViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static

from allauth.socialaccount.providers.github.views import GitHubOAuth2Adapter
from dj_rest_auth.registration.views import SocialLoginView
from dj_rest_auth.views import LoginView

class GitHubLogin(SocialLoginView):
    adapter_class = GitHubOAuth2Adapter
    client_class = GitHubOAuth2Adapter.client_class
    scope_delimiter = ' '


router = routers.DefaultRouter()
router.register('categorias', CategoriaViewSet, basename='Categorias')
router.register('produtos', ProdutoViewSet, basename='Produtos')
router.register('perfis', PerfilViewSet, basename='Perfis')


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include(router.urls)),
    path('accounts/', include('allauth.urls')),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # path('github/callback/', GitHubTokenViewSet.as_view({'get': 'github_callback'}), name='github_callback'),
     path('api/github/token/', GitHubAccessTokenView.as_view(), name='github_access_token'),

    path('auth/login/', LoginView.as_view(), name='rest_login'),
    path('auth/registration/', include('dj_rest_auth.registration.urls')),

    # path('dj-rest-auth/github/', GitHubLogin.as_view(), name='github_login'),
    path('dj-rest-auth/', include('dj_rest_auth.urls')),  # Endpoints principais
    path('dj-rest-auth/registration/', include('dj_rest_auth.registration.urls')),

    path('produto/<int:pk>', ProdutoViewSet.as_view({'get': 'retrieve', 'put':'update'}), name='Produto'),
    path('categorias/<str:categoria>', CategoriaProdutosViewSet.as_view({'get': 'list'}), name='Categorias'),
    path('carrinhos/<int:usuario>/<int:item_id>/', ItemCarrinhoViewSet.as_view({'get': 'retrieve', 'delete': 'destroy', 'put': 'update'}), name='CarrinhoItem'),
    path('carrinhos/<int:usuario>/', ItemCarrinhoViewSet.as_view({'get': 'list', 'post': 'create', 'put': 'update'}), name='CarrinhoUsuario'),
    path('listaDesejos/<int:usuario>/<int:item_id>/', ListaDesejosViewSet.as_view({'get': 'retrieve', 'delete': 'destroy'}), name='ListaDesejosItem'),
    path('listaDesejos/<int:usuario>/', ListaDesejosViewSet.as_view({'get': 'list', 'post': 'create'}), name='ListaDesejosUsuario'),
    path('pedidos/<int:usuario>/', PedidoViewSet.as_view({'get': 'list', 'post': 'create'}), name='PedidosUsuario'),
    path('register/', UserCreateView.as_view(), name='user-register'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
