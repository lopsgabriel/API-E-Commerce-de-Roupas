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
    preco = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    quantidade = models.PositiveIntegerField(default=1)

    def save(self, *args, **kwargs):
        self.preco = self.produto.preco
        super().save(*args, **kwargs)
        
    def __str__(self):
        return f'{self.produto} x {self.quantidade}'
    
class Lista_Desejos(models.Model):
    usuario = models.ForeignKey(Perfil, on_delete=models.CASCADE, related_name='lista_desejos')
    produto = models.ForeignKey(Produto, on_delete=models.CASCADE)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['usuario', 'produto'], name='unique_usuario_produto')
        ]

    def __str__(self):
        return f'{self.produto}'