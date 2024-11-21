from django.db import models
from roupas.models import Produto

class Perfil(models.Model):
    usuario = models.OneToOneField('auth.User', on_delete=models.CASCADE, related_name='perfil')
    carteira = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def __str__(self):
        return self.usuario.username

class Item_carrinho(models.Model):
    perfil_carrinho = models.ForeignKey(Perfil, on_delete=models.CASCADE, related_name='Item_carrinho')
    produto = models.ForeignKey(Produto, on_delete=models.CASCADE)
    quantidade = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f'{self.produto} x {self.quantidade}'