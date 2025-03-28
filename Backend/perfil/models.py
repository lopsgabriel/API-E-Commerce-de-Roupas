from django.db import models
from roupas.models import Produto

class Perfil(models.Model):
    """
    Representa o perfil de um usuário. Cada perfil está vinculado a um usuário do Django.
    O perfil contém informações como a carteira do usuário.
    """
    usuario = models.OneToOneField('auth.User', on_delete=models.CASCADE, related_name='perfil')
    """
    Relacionamento de um para um com o modelo User. Cada usuário possui um perfil único.
    Quando o usuário for excluído, o perfil também será excluído.
    """
    
    carteira = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    """
    Carteira do usuário, representando um saldo em dinheiro ou crédito.
    É um campo decimal com até 10 dígitos, sendo 2 casas decimais.
    O valor inicial é 0.
    """

    def __str__(self):
        """
        Retorna o nome de usuário (username) do perfil para representações simples.
        """
        return self.usuario.username

class Item_carrinho(models.Model):
    """
    Representa um item no carrinho de compras de um usuário.
    Cada item é um produto adicionado ao carrinho, com uma quantidade e preço.
    """
    usuario = models.ForeignKey(Perfil, on_delete=models.CASCADE, related_name='Item_carrinho')
    """
    Relacionamento com o perfil do usuário.
    Quando o perfil é excluído, todos os itens no carrinho relacionados também são excluídos.
    """
    
    produto = models.ForeignKey(Produto, on_delete=models.CASCADE)
    """
    Relacionamento com o modelo Produto. Cada item no carrinho é um produto específico.
    """
    
    preco = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    """
    Preço do produto no momento da adição ao carrinho.
    O valor inicial é 0 e é atualizado automaticamente com o preço do produto.
    """
    
    quantidade = models.PositiveIntegerField(default=1)
    """
    Quantidade do produto no carrinho. O valor padrão é 1.
    """

    def save(self, *args, **kwargs):
        """
        Sobrescreve o método save para garantir que o preço do item seja atualizado com o preço atual do produto.
        """
        self.preco = self.produto.preco
        super().save(*args, **kwargs)
        
    def __str__(self):
        """
        Retorna a representação do item como produto x quantidade.
        """
        return f'{self.produto} x {self.quantidade}'
    
class Lista_Desejos(models.Model):
    """
    Representa a lista de desejos de um usuário.
    Cada item da lista é um produto que o usuário deseja comprar no futuro.
    """
    usuario = models.ForeignKey(Perfil, on_delete=models.CASCADE, related_name='lista_desejos')
    """
    Relacionamento com o perfil do usuário.
    Quando o perfil é excluído, todos os itens na lista de desejos também são excluídos.
    """
    
    produto = models.ForeignKey(Produto, on_delete=models.CASCADE)
    """
    Relacionamento com o modelo Produto. Cada item na lista de desejos é um produto específico.
    """
    
    class Meta:
        """
        Define uma restrição única para garantir que um usuário não possa adicionar o mesmo produto mais de uma vez à sua lista de desejos.
        """
        constraints = [
            models.UniqueConstraint(fields=['usuario', 'produto'], name='unique_usuario_produto')
        ]

    def __str__(self):
        """
        Retorna a representação do produto na lista de desejos.
        """
        return f'{self.produto}'
    
class Pedido(models.Model):
    """
    Representa um pedido realizado por um usuário.
    Cada pedido contém um ou mais itens (produtos) e o status do pedido.
    """
    usuario = models.ForeignKey(Perfil, on_delete=models.CASCADE, related_name='pedidos')
    """
    Relacionamento com o perfil do usuário que fez o pedido.
    Quando o perfil é excluído, todos os pedidos do usuário também são excluídos.
    """
    
    data_criacao = models.DateTimeField(auto_now_add=True)
    """
    Data e hora de criação do pedido. A data é automaticamente preenchida quando o pedido é criado.
    """
    
    status = models.CharField(
        max_length=20,
        choices=[('pendente', 'Pendente'), ('enviado', 'Enviado'), ('entregue', 'Entregue')],
        default='pendente'
    )
    """
    Status do pedido. Pode ser um dos seguintes:
    - 'pendente' (por padrão)
    - 'enviado'
    - 'entregue'
    """
    
    def __str__(self):
        """
        Retorna a representação do pedido como 'Pedido [ID] - [Nome do Usuário]'.
        """
        return f'Pedido {self.id} - {self.usuario}'

class ItemPedido(models.Model):
    """
    Representa um item de um pedido. Cada item é um produto incluído no pedido.
    """
    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE, related_name='itens')
    """
    Relacionamento com o pedido ao qual o item pertence.
    Quando o pedido é excluído, todos os itens do pedido também são excluídos.
    """
    
    produto = models.ForeignKey(Produto, on_delete=models.CASCADE)
    """
    Relacionamento com o modelo Produto. Cada item no pedido é um produto específico.
    """
    
    quantidade = models.PositiveIntegerField(default=1)
    """
    Quantidade do produto no pedido. O valor padrão é 1.
    """
    
    preco = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    """
    Preço do produto no momento da criação do item do pedido.
    O valor inicial é 0 e é atualizado automaticamente com o preço do produto.
    """
    
    def save(self, *args, **kwargs):
        """
        Sobrescreve o método save para garantir que o preço do item seja atualizado com o preço atual do produto.
        """
        self.preco = self.produto.preco
        super().save(*args, **kwargs)

    def __str__(self):
        """
        Retorna a representação do item no pedido como 'Produto x Quantidade'.
        """
        return f'{self.produto} x {self.quantidade}'
