from django.urls import path, include
from django.contrib.auth.models import User, Group
from django.contrib import admin
admin.autodiscover()
from rest_framework import routers, generics, serializers, permissions 
from oauth2_provider import urls as oauth2_urls
from oauth2_provider.contrib.rest_framework import TokenHasReadWriteScope, TokenHasScope

from perfil.views import PerfilViewSet,ItemCarrinhoViewSet, ListaCarrinhoViewSet, ListaDesejosViewSet, UserCreateView, PedidoViewSet
from roupas.views import CategoriaViewSet, ProdutoViewSet, CategoriaProdutosViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static
# from oauth2_provider.views.token import TokenView

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email', "first_name", "last_name")

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ("name", )

# Create the API views
class UserList(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated, TokenHasReadWriteScope]
    queryset = User.objects.all()
    serializer_class = UserSerializer

class UserDetails(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated, TokenHasReadWriteScope]
    queryset = User.objects.all()
    serializer_class = UserSerializer

class GroupList(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated, TokenHasScope]
    required_scopes = ['groups']
    queryset = Group.objects.all()
    serializer_class = GroupSerializer


router = routers.DefaultRouter()
router.register('categorias', CategoriaViewSet, basename='Categorias')
router.register('produtos', ProdutoViewSet, basename='Produtos')
router.register('perfis', PerfilViewSet, basename='Perfis')
urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include(router.urls)),
    # path("oauth/token/", TokenView.as_view(), name="token"),
    path('o/', include(oauth2_urls)),
    path('users/', UserList.as_view()),
    path('users/<pk>/', UserDetails.as_view()),
    path('groups/', GroupList.as_view()),
    path('accounts/', include('allauth.urls')),
    path('auth/', include('dj_rest_auth.urls')),
    path('auth/registration/', include('dj_rest_auth.registration.urls')),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
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
