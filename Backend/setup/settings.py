"""
Configuração principal do Django para a API.

Este arquivo contém as configurações do projeto, incluindo:
- Segurança e autenticação
- Aplicações instaladas
- Configuração do banco de dados
- Configuração de CORS e Middleware
- Configuração de Tokens JWT

"""

from dotenv import load_dotenv  # Carrega variáveis do arquivo .env
from pathlib import Path, os
from datetime import timedelta

# Define o diretório base do projeto
BASE_DIR = Path(__file__).resolve().parent.parent

# Chave secreta para criptografia e segurança
SECRET_KEY = str(os.getenv('SECRET_KEY'))

# Define se o modo de depuração está ativo (NÃO usar em produção)
DEBUG = True

# Hosts permitidos para acesso à API
ALLOWED_HOSTS = []

# Aplicações instaladas no Django
INSTALLED_APPS = [
    'django.contrib.admin',  # Interface de administração
    'django.contrib.auth',  # Sistema de autenticação
    'django.contrib.contenttypes',  # Tipo de conteúdo
    'django.contrib.sessions',  # Gerenciamento de sessões
    'django.contrib.messages',  # Sistema de mensagens
    'django.contrib.staticfiles',  # Arquivos estáticos

    # Aplicações da API
    'roupas',  # App para gerenciar roupas
    'perfil',  # App para gerenciar perfis

    # Bibliotecas externas
    'rest_framework',  # Django Rest Framework para criação de APIs
    'rest_framework_simplejwt',  # Autenticação JWT
    'corsheaders',  # Controle de CORS
]

# Middlewares (intermediários que processam as requisições)
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    "corsheaders.middleware.CorsMiddleware",  # Permitir requisições de outros domínios
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# Configuração de URLs principais
ROOT_URLCONF = 'setup.urls'

# Configuração de templates (HTML)
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# Definir que a API usará JWT como padrão para autenticação
REST_USE_JWT = True

# Configuração do WSGI (Web Server Gateway Interface)
WSGI_APPLICATION = 'setup.wsgi.application'

# Configuração do banco de dados (SQLite)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Validações de senha (padrões do Django)
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# Configuração de idioma e fuso horário
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Configuração de arquivos estáticos e mídia
STATIC_URL = 'static/'
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Definição de chave primária automática para os modelos
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Configuração do Django Rest Framework (DRF)
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',  # Autenticação baseada em sessão
        'rest_framework.authentication.BasicAuthentication',  # Autenticação básica
        'rest_framework_simplejwt.authentication.JWTAuthentication',  # Autenticação JWT
    ],
    'DEFAULT_PERMISSION_CLASSES': (
        # 'rest_framework.permissions.IsAuthenticated',  # Restringe acesso apenas para usuários autenticados
    ),
    'DEFAULT_FILTER_BACKENDS': ['django_filters.rest_framework.DjangoFilterBackend'],
}

# Configuração de CORS (Cross-Origin Resource Sharing)
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # Permite o front-end local acessar a API
    "http://127.0.0.1:5173",
]

CORS_ALLOW_HEADERS = [
    'content-type',
    'authorization',
    'Access-Control-Allow-Origin',
    'Access-Control-Allow-Credentials',
]

CORS_ALLOW_CREDENTIALS = True  # Permite envio de cookies de autenticação

# Configuração do JWT (JSON Web Token)
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=180),  # Tempo de expiração do token de acesso (3 horas)
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),  # Tempo de expiração do token de atualização (1 dia)
    'ROTATE_REFRESH_TOKENS': False,  # Não rotaciona tokens de atualização
    'BLACKLIST_AFTER_ROTATION': True,  # Invalida tokens antigos após rotação
    'UPDATE_LAST_LOGIN': True,  # Atualiza o último login do usuário
}
