from django.db import models
from roupas.models import Produto

class Perfil(models.Model):
    usuario = models.OneToOneField('auth.User', on_delete=models.CASCADE, related_name='perfil')
    carteira = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def __str__(self):
        return self.usuario.username

class Item_carrinho(models.Model):
    usuario = models.ForeignKey(Perfil, on_delete=models.CASCADE, related_name='Item_carrinho')
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
    
    # No pedido tem que ter uma array de produtos, no caso cada pedido tem um ou mais produtos
class Pedido(models.Model):
    usuario = models.ForeignKey(Perfil, on_delete=models.CASCADE, related_name='pedidos')
    data_criacao = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=20,
        choices=[('pendente', 'Pendente'), ('enviado', 'Enviado'), ('entregue', 'Entregue')],
        default='pendente'
    )

    def __str__(self):
        return f'Pedido {self.id} - {self.usuario}'

class ItemPedido(models.Model):
    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE, related_name='itens')
    produto = models.ForeignKey(Produto, on_delete=models.CASCADE)
    quantidade = models.PositiveIntegerField(default=1)
    preco = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def save(self, *args, **kwargs):
        self.preco = self.produto.preco
        super().save(*args, **kwargs)

    def __str__(self):
        return f'{self.produto} x {self.quantidade}'