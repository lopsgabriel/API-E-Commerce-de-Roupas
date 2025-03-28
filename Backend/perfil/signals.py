from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import Perfil

# Signal que é acionado após a criação de um usuário.
@receiver(post_save, sender=User)
def criar_perfil_usuario(sender, instance, created, **kwargs):
    """
    Sinal que cria um perfil de usuário automaticamente quando um novo usuário é criado.

    - **sender**: A classe que disparou o sinal (User).
    - **instance**: A instância do modelo User que foi salva.
    - **created**: Um booleano que indica se a instância foi criada (True) ou atualizada (False).
    - **kwargs**: Outros parâmetros opcionais.

    Quando um novo usuário é criado, este sinal cria automaticamente um objeto **Perfil** associado a esse usuário.
    """
    if created:
        Perfil.objects.create(usuario=instance)


# Signal que é acionado após a atualização de um usuário.
@receiver(post_save, sender=User)
def salvar_perfil_usuario(sender, instance, **kwargs):
    """
    Sinal que salva o perfil de um usuário sempre que o usuário for salvo (atualizado).

    - **sender**: A classe que disparou o sinal (User).
    - **instance**: A instância do modelo User que foi salva.
    - **kwargs**: Outros parâmetros opcionais.

    Sempre que os dados do usuário são atualizados, este sinal garante que o perfil associado também seja salvo.
    """
    instance.perfil.save()
